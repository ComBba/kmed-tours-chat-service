// located at /pages/api/gallerySearch.js
import axios from 'axios';

export default async function handler(req, res) {
    const keyword = encodeURIComponent(req.query.keyword);
    const serviceKey = encodeURIComponent(process.env.DATA_GO_KR_API_KEY);

    if (!keyword) {
        res.status(400).json({ error: 'Keyword is required.' });
        return;
    }
    const url = `https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=KMED_Tours&arrange=B&keyword=${keyword}&_type=json&serviceKey=${serviceKey}`;

    try {
        const response = await axios.get(
            url
        );
        //console.log("[API response]", url, response.data.response.body.items);
        if (response.data.response.header.resultCode !== '0000') {
            throw new Error(response.data.response.header.resultMsg);
        }

        res.status(200).json(response.data.response.body.items);
    } catch (error) {
        console.error("[API error]", url, error);
        res.status(500).json({ error: error.message });
    }
}
