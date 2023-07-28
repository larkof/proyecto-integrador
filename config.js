const PERSISTENCE_TYPE = {
    TYPE_MEM: 'MEMORY',
    TYPE_FILE: 'FILE SYSTEM',
    TYPE_MONGODB: 'MONGODB',
};

const config = {
    
    PORT: 3000,
    PERSISTENCE_TYPE: PERSISTENCE_TYPE.TYPE_MONGODB,
    MONGODB_CONNECTION_STR: 'mongodb+srv://rodriguezleonardoandres:FKZFphBPSWYV1Cje@cluster0.ulydt00.mongodb.net/ecommerce',
    MONGODB_TIMEOUT: 2000,  // Valor bajo para TESTING
};

export {PERSISTENCE_TYPE, config as default};
