import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});

const indexName = process.env.PINECONE_INDEX_NAME || 'codeservir-embeddings';

export const getPineconeIndex = () => {
    return pinecone.index(indexName);
};

export const initializePinecone = async () => {
    try {
        console.log('🔄 Initializing Pinecone...');

        // Check if index exists
        const indexes = await pinecone.listIndexes();
        const indexExists = indexes.indexes?.some(index => index.name === indexName);

        if (!indexExists) {
            console.log(`📝 Creating Pinecone index: ${indexName}`);
            await pinecone.createIndex({
                name: indexName,
                dimension: 1536, // OpenAI embedding dimension
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            console.log('✅ Pinecone index created successfully');
        } else {
            console.log('✅ Pinecone index already exists');
        }

        return getPineconeIndex();
    } catch (error) {
        console.error('❌ Failed to initialize Pinecone:', error);
        throw error;
    }
};

export default pinecone;
