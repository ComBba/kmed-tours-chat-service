// located at /pages/api/gallerySearch.js
import { cachedFetch } from './cache'; // 캐싱 함수를 import 합니다.

export default async function handler(req, res) {
    const keyword = encodeURIComponent(req.query.keyword);
    const serviceKey = encodeURIComponent(process.env.DATA_GO_KR_API_KEY);
    const page = Number(req.query.page) || 1; // 페이지 정보를 가져옴

    if (!keyword) {
        res.status(400).json({ error: 'Keyword is required.' });
        return;
    }
    const url = `https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?numOfRows=12&pageNo=${page}&MobileOS=ETC&MobileApp=KMED_Tours&arrange=B&keyword=${keyword}&_type=json&serviceKey=${serviceKey}`;

    try {
        const response = await cachedFetch(url); // axios.get 대신 캐싱 함수를 사용합니다.

        if (response.data.response.header.resultCode !== '0000') {
            throw new Error(response.data.response.header.resultMsg);
        }

        const items = response.data.response.body.items;
        const totalCount = response.data.response.body.totalCount;
        const totalPages = Math.ceil(totalCount / 12);

        res.status(200).json({
            items,
            totalPages,
        });
    } catch (error) {
        console.error("[API error]", url, error);
        res.status(500).json({ error: error.message });
    }
}