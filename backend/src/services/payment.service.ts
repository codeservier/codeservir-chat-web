import { query } from '../config/database';
import { cacheSet } from '../config/redis';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface PaymentPlan {
    name: string;
    price: number;
    chatLimit: number;
    currency: string;
}

export const PAYMENT_PLANS: { [key: string]: PaymentPlan } = {
    basic: {
        name: 'Basic',
        price: 999,
        chatLimit: 100000,
        currency: 'INR',
    },
    pro: {
        name: 'Pro',
        price: 1999,
        chatLimit: 1000000,
        currency: 'INR',
    },
    premium: {
        name: 'Premium',
        price: 5999,
        chatLimit: 100000000,
        currency: 'INR',
    },
};

export class PaymentService {
    private razorpay: any;

    constructor() {
        // Initialize Razorpay
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }
    }

    /**
     * Create Razorpay order
     */
    async createOrder(chatbotId: string, planType: string): Promise<any> {
        try {
            const plan = PAYMENT_PLANS[planType];
            if (!plan) {
                throw new Error('Invalid plan type');
            }

            const options = {
                amount: plan.price * 100, // Amount in paise
                currency: plan.currency,
                receipt: `receipt_${chatbotId}_${Date.now()}`,
                notes: {
                    chatbotId,
                    planType,
                },
            };

            const order = await this.razorpay.orders.create(options);

            return {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
            };
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new Error('Failed to create payment order');
        }
    }

    /**
     * Verify Razorpay payment
     */
    async verifyPayment(
        orderId: string,
        paymentId: string,
        signature: string
    ): Promise<boolean> {
        try {
            const text = `${orderId}|${paymentId}`;
            const generated_signature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
                .update(text)
                .digest('hex');

            return generated_signature === signature;
        } catch (error) {
            console.error('Error verifying payment:', error);
            return false;
        }
    }

    /**
     * Process successful payment
     */
    async processPayment(
        chatbotId: string,
        planType: string,
        paymentId: string,
        orderId: string,
        amount: number
    ): Promise<void> {
        try {
            const plan = PAYMENT_PLANS[planType];
            if (!plan) {
                throw new Error('Invalid plan type');
            }

            // Deactivate old subscriptions
            await query(
                `UPDATE subscriptions 
         SET is_active = false 
         WHERE chatbot_id = $1`,
                [chatbotId]
            );

            // Create new subscription
            const subResult = await query(
                `INSERT INTO subscriptions 
         (chatbot_id, plan_type, chat_limit, price, payment_id, payment_status, is_active)
         VALUES ($1, $2, $3, $4, $5, 'completed', true)
         RETURNING id`,
                [chatbotId, planType, plan.chatLimit, plan.price, paymentId]
            );

            const subscriptionId = subResult.rows[0].id;

            // Record transaction
            await query(
                `INSERT INTO payment_transactions 
         (chatbot_id, subscription_id, payment_gateway, transaction_id, amount, currency, status)
         VALUES ($1, $2, 'razorpay', $3, $4, $5, 'success')`,
                [chatbotId, subscriptionId, paymentId, amount / 100, plan.currency]
            );

            // Reset chat count in cache
            await cacheSet(`chatbot:${chatbotId}:count`, '0');

            // Reset in database
            await query(
                `UPDATE chat_usage 
         SET chat_count = 0 
         WHERE chatbot_id = $1`,
                [chatbotId]
            );

            console.log(`✅ Payment processed for chatbot: ${chatbotId}, Plan: ${planType}`);
        } catch (error) {
            console.error('Error processing payment:', error);
            throw new Error('Failed to process payment');
        }
    }

    /**
     * Get subscription details
     */
    async getSubscription(chatbotId: string): Promise<any> {
        try {
            const result = await query(
                `SELECT s.*, cu.chat_count 
         FROM subscriptions s
         LEFT JOIN chat_usage cu ON s.chatbot_id = cu.chatbot_id
         WHERE s.chatbot_id = $1 AND s.is_active = true
         ORDER BY s.created_at DESC
         LIMIT 1`,
                [chatbotId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const subscription = result.rows[0];
            return {
                planType: subscription.plan_type,
                chatLimit: subscription.chat_limit,
                chatCount: subscription.chat_count || 0,
                remainingChats: subscription.chat_limit - (subscription.chat_count || 0),
                price: subscription.price,
                startedAt: subscription.started_at,
                isActive: subscription.is_active,
            };
        } catch (error) {
            console.error('Error getting subscription:', error);
            return null;
        }
    }

    /**
     * Get payment history
     */
    async getPaymentHistory(chatbotId: string): Promise<any[]> {
        try {
            const result = await query(
                `SELECT * FROM payment_transactions 
         WHERE chatbot_id = $1 
         ORDER BY created_at DESC`,
                [chatbotId]
            );

            return result.rows;
        } catch (error) {
            console.error('Error getting payment history:', error);
            return [];
        }
    }
}

export default new PaymentService();
