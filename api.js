const API_URL = "https://your-api-gateway-url/jobs"; // Replace with your actual API Gateway endpoint

export async function fetchJobs(limit = 1000, nextToken = null) {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("limit", limit);
    if (nextToken) {
      url.searchParams.append("nextToken", nextToken);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return {
      jobs: data.jobs || [],
      nextToken: data.nextToken || null
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], nextToken: null };
  }
}
