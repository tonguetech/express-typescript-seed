import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

interface UserResponse {
    user: UserObj,
    jwt: String
}

interface UserObj {
    email: string,
    fullName: string,
    id: string
}

async function insertUsers(): Promise<AxiosResponse<UserResponse>[]> {
    const config = <AxiosRequestConfig>{
        baseURL: 'http://localhost:8082'
    };
    const responses = [];
    for (let i = 0; i < 100; i++) {
        const newUser = {
            email: `testuser${i}@example.com`,
            password: '1234',
            fullName: `testuser${i}`
        };
        const response = axios.post<UserResponse>('/api/v1/auth/signup', newUser, config);
        responses.push(response);
    }
    const result = Promise.all(responses);
    return result;
}

(async () => {
    try {
        console.log("Start testing inserting 100 users");
        const responses = await insertUsers();
        const users = responses.map((elem) => { return elem.data });
        console.log(users);
    } catch (err) {
        console.error(err);
    }
})();