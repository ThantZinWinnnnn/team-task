import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor") || "";
  const perPage = searchParams.get("per_page") || "10";
  const searchQuery = searchParams.get("search") || "";

  try {
    let apiUrl = `${process.env.API_URL}/v1/players?season=2024&per_page=${perPage}`;

    if (cursor) {
      apiUrl += `&cursor=${cursor}`;
    }

    if (searchQuery) {
      apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const fetchWithRetry = async (
      url: string,
      options: RequestInit,
      maxRetries: number = 3
    ): Promise<Response> => {
      let retries = 0;

      while (retries < maxRetries) {
        const response = await fetch(url, options);

        if (response.status !== 429) {
          return response;
        }

        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfter = retryAfterHeader
          ? parseInt(retryAfterHeader, 10)
          : Math.pow(2, retries) * 1000;

        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        retries++;
      }

      throw new Error("Rate limit exceeded after maximum retries");
    };

    const response = await fetchWithRetry(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BALLDONTLIE_API_KEY || ""}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
