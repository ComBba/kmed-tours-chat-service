// located at /pages/api/cache.js
import axios from 'axios';

const cache = new Map(); // 간단한 메모리 캐시를 구현하기 위해 Map 객체를 사용합니다.

export async function cachedFetch(url, cacheTime = 5 * 60 * 1000) {
    // 캐시에서 URL에 해당하는 데이터를 찾습니다.
    const cached = cache.get(url);

    if (cached && Date.now() - cached.time < cacheTime) {
        // 캐시가 만료되지 않았다면, 캐시된 값을 반환합니다.
        return cached.data;
    } else {
        // 캐시가 없거나 만료되었다면, 실제로 데이터를 가져옵니다.
        const response = await axios.get(url);
        // 가져온 데이터를 캐시에 저장합니다.
        cache.set(url, { data: response, time: Date.now() });
        return response;
    }
}