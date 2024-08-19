import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.chenb.vid',
    projectId: '66b8c413000d2e69af3d',
    databaseId: '66bca610001594cf3fb3',
    userCollectionId: '66bca649000c01a3cb42',
    videoCollectionId: '66bca67b000fb8b8603d',
    storageId: '66bca87800079e19480a'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password)
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        // await account.deleteSession("current")
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        throw new Error(error)
    }
}

// export const signIn = async (email, password) => {
//     await account.deleteSession("current")
//     const session = await account.createEmailPasswordSession(email, password)
//     return session 
// }

export const getCurrentUser =  async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)] // getting the exact user that's currently logged in
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}


// export const getCurrentUser = async () => {
//     try {
//       const currentAccount = await account.get();
//       if (!currentAccount) throw Error;
  
//       // const currentUser = await databases.listDocuments(
//       //   config.databaseId,
//       //   config.userCollectionId,
//       //   [Query.equal("accountId", currentAccount.$id)]
//       // );
  
//       // if (!currentUser) throw Error;
  
//       // return currentUser.documents[0];
  
//       return currentAccount;
//     } catch (error) {
//       throw new Error(error);
//     }
//   };

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.videoCollectionId)
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.videoCollectionId, 
            [Query.orderDesc('$createdAt', Query.limit(7))])
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}