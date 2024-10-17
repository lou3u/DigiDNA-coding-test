export const dbConfig = {
    name: "MyDB",
    version: 1,
    objectStoresMeta: [
        {
            store: "artist",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [

                { name: "artistId", keypath: "artistId", options: { unique: true } },
                { name: "title", keypath: "title", options: { unique: false } },
            ],
        },
    ],
};