/* eslint-disable react-hooks/exhaustive-deps */
import { useSidebarContext } from "@/context/SidebarContext";
import { Button } from "@/components/ui/button";
import { adminRoutes } from "@/constants/routeUrl";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import ProblemsTable from "@/components/ProblemTable";
import debounce from "debounce";
import { ProblemListType } from "@/types/types";

const Problems = () => {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useSidebarContext();
  const { toast } = useToast();

  const [problems, setProblems] = useState<ProblemListType[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemListType[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlQuery, setUrlQuery] = useState({
    page: "1",
    sortBy: "problemNo",
    sortOrder: "1",
    filter: "",
  });

  const filteredUrl = (
    filter = "",
    page = "1",
    sortBy = "problemNo",
    sortOrder = "1"
  ) => {
    if (urlQuery.page !== page) setUrlQuery({ ...urlQuery, page });
    if (urlQuery.sortBy !== sortBy) setUrlQuery({ ...urlQuery, sortBy });
    if (urlQuery.sortOrder !== sortOrder)
      setUrlQuery({ ...urlQuery, sortOrder });
    if (urlQuery.filter !== filter) setUrlQuery({ ...urlQuery, filter });

    return new URLSearchParams({ page, sortBy, sortOrder, filter }).toString();
  };

  const debouncedSetQuery = useCallback(
    debounce((val) => setQuery(val), 1500),
    []
  );

  useEffect(() => {
    setBreadcrumbs([{ component: "Problems" }]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getProblems();

      if (response.success) { // Log the problems data
        setProblems(response.data.problems);
        setFilteredProblems(response.data.problems);
        setPageData((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
        }));
        setLoading(false);
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    debouncedSetQuery(search);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const filteredProbs = problems.filter((problem) => {
      return (
        problem.title.toLowerCase().startsWith(search.toLowerCase()) ||
        String(problem.problemNo).startsWith(search)
      );
    });
    if (filteredProbs.length) {
      setFilteredProblems(filteredProbs);
      setLoading(false);
    } else {
      (async () => {
        const response = await getProblems(
          filteredUrl(
            search,
            urlQuery.page,
            urlQuery.sortBy,
            urlQuery.sortOrder
          )
        );

        if (response.success) {
          setFilteredProblems(response.data.problems);
          setPageData((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
          }));
          setLoading(false);
        } else {
          toast({
            description: response.error,
            variant: "destructive",
          });
          setLoading(false);
        }
      })();
    }
  }, [query]);

  const sort = async (sortBy: string) => {
    let sortOrder = urlQuery.sortOrder;
    if (urlQuery.sortBy !== sortBy) {
      sortOrder = "1"; // Default to ascending order
    } else {
      // Toggle sort order
      sortOrder = urlQuery.sortOrder === "1" ? "-1" : "1";
    }

    setLoading(true);
    const response = await getProblems(
      filteredUrl(urlQuery.filter, urlQuery.page, sortBy, sortOrder)
    );

    if (response.success) {
      setFilteredProblems(response.data.problems);
      setPageData((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
      }));
      setLoading(false);
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const setPage = useCallback(
    async (page: number) => {
      setLoading(true);

      const url = filteredUrl(
        urlQuery.filter,
        String(page),
        urlQuery.sortBy,
        urlQuery.sortOrder
      );

      const response = await getProblems(url);

      if (response.success) {
        setProblems(response.data.problems);

        setFilteredProblems(response.data.problems);
        setPageData((prev) => ({
          ...prev,
          page,
          totalPages: response.data.totalPages,
        }));
      } else {
        toast({ description: response.error, variant: "destructive" });
      }

      setLoading(false);
    },
    [urlQuery]
  );

  const [pageData, setPageData] = useState({ page: 1, totalPages: 1, setPage });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => navigate(`/admin${adminRoutes.ADD_PROBLEM}`)}
          className="font-bold font-mono bg-mildgreen"
          size={"lg"}
        >
          Add Problem
        </Button>
      </div>
      <ProblemsTable
        data={filteredProblems}
        userLevel="admin"
        loading={loading}
        search={search}
        setSearch={setSearch}
        sort={sort}
        pageData={pageData}
      />
    </div>
  );
};

export default Problems;
