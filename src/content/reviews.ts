import { getCollection } from "astro:content";


export async function mostRecentReviews(limit: number) {
    const allReviews = await getCollection("reviews");

    allReviews.sort((a, b) => {
        return b.data.date.getTime() - a.data.date.getTime();
    })
    
    return allReviews.slice(0, limit);
}