"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAbstraxionClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS || "";


interface Profile {
  username: string;
  name: string;
  bio?: string;
  profile_picture?: string;
  banner_image?: string;
}

export default function DiscoverPage() {
  const { client: queryClient } = useAbstraxionClient();

  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredResults, setFilteredResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);
  const [moreToLoad, setMoreToLoad] = useState(true);

  useEffect(() => {
    const fetchFromContract = async () => {
      if (!queryClient) return;
      setIsLoading(true);

      try {
        const query = lastFetchedId
          ? { list_profiles: { limit: 50, start_after: lastFetchedId } }
          : { list_profiles: { limit: 50 } };

        const res = await queryClient.queryContractSmart(CONTRACT_ADDRESS, query);

        if (res.profiles) {
          setAllProfiles((prev: Profile[]) => {
            const existingUsernames = new Set(prev.map(p => p.username));
            const newProfiles = res.profiles.filter((p: Profile) => !existingUsernames.has(p.username));
            return [...prev, ...newProfiles];
          });

          setMoreToLoad(res.profiles.length === 50);
          if (res.profiles.length > 0) {
            setLastFetchedId(res.profiles[res.profiles.length - 1].username);
          }
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setErrorMsg("Unable to load profiles at the moment.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromContract();
  }, [queryClient, lastFetchedId]);

  useEffect(() => {
    const query = searchInput.toLowerCase();

    const results = allProfiles.filter(profile =>
      profile.username.toLowerCase().includes(query) ||
      profile.name.toLowerCase().includes(query) ||
      (profile.bio && profile.bio.toLowerCase().includes(query))
    );

    setFilteredResults(query ? results : allProfiles);
    setPageCount(Math.ceil((query ? results.length : allProfiles.length) / ITEMS_PER_PAGE));
    setPage(1);
  }, [searchInput, allProfiles]);

  const visibleProfiles = () => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  };

  const loadMore = () => {
    if (moreToLoad && !isLoading) {
      setIsLoading(true); // trigger useEffect re-fetch
    }
  };

  const changePage = (targetPage: number) => {
    if (targetPage < 1 || targetPage > pageCount) return;
    setPage(targetPage);

    if (
      targetPage === pageCount &&
      moreToLoad &&
      filteredResults.length < allProfiles.length + 10
    ) {
      loadMore();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Discover Artists</h1>

      {/* Search Field */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, handle, or bio..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Loader or Profiles */}
      {isLoading && allProfiles.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProfiles().map((profile) => (
                <Link href={`/tip/${profile.username}`} key={profile.username}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                      {profile.banner_image && (
                        <Image
                          src={profile.banner_image}
                          alt={`${profile.name}'s banner`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div className="p-5 relative">
                      <div className="absolute -top-10 left-4 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden shadow-md w-16 h-16">
                        {profile.profile_picture ? (
                          <Image
                            src={profile.profile_picture}
                            alt={profile.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-300 text-2xl text-gray-500 rounded-full">
                            {profile.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="mt-8">
                        <h3 className="text-xl font-bold">{profile.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
                        <p className="mt-2 line-clamp-2">{profile.bio || "This creator hasn't added a bio yet."}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl">No creators found with that search.</p>
              {searchInput && (
                <Button structure="base" className="mt-4" onClick={() => setSearchInput("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredResults.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center mt-10 space-x-2">
              <Button
                structure="base"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2"
              >
                <FaArrowLeft />
              </Button>

              <div className="flex space-x-2">
                {[...Array(pageCount)].map((_, i) => {
                  const pg = i + 1;
                  if (
                    pg === 1 ||
                    pg === pageCount ||
                    (pg >= page - 1 && pg <= page + 1)
                  ) {
                    return (
                      <Button
                        key={i}
                        structure="base"
                        className={`px-4 py-2 ${pg === page ? "bg-purple-600 text-white" : ""}`}
                        onClick={() => changePage(pg)}
                      >
                        {pg}
                      </Button>
                    );
                  }
                  if (
                    (pg === 2 && page > 3) ||
                    (pg === pageCount - 1 && page < pageCount - 2)
                  ) {
                    return <span key={i} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                structure="base"
                onClick={() => changePage(page + 1)}
                disabled={page === pageCount}
                className="px-4 py-2"
              >
                <FaArrowRight />
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {moreToLoad && filteredResults.length === allProfiles.length && (
            <div className="text-center mt-10">
              <Button
                structure="base"
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-3"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white mr-2 rounded-full"></div>
                    Loading...
                  </span>
                ) : (
                  "Load More Creators"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
