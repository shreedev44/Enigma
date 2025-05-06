/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { blockAction, getRecruiters, getStudents } from "@/api/admin";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/adminComponents/UserTable";
import { RecruiterData, StudentData } from "@/types/formTypes";
import debounce from 'debounce'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import defaultPic from "../../assets/default-avatar.jpg";
import { ScrollArea } from "@/components/ui/scroll-area";

const Users = (props: { user: "student" | "recruiter" }) => {
  const { setBreadcrumbs } = useSidebarContext();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterData[]>([]);
  const [filtered, setFiltered] = useState<RecruiterData[] | StudentData[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlQuery, setUrlQuery] = useState({
    page: "1",
    sortBy: "createdAt",
    sortOrder: "1",
    filter: "",
  });
  const debouncedSetQuery = useCallback(
    debounce((val) => setQuery(val), 1500),
    []
  );

  const filteredUrl = (
    filter = "",
    page = "1",
    sortBy = "createdAt",
    sortOrder = "1"
  ) => {
    if (urlQuery.page !== page) setUrlQuery({ ...urlQuery, page });
    if (urlQuery.sortBy !== sortBy) setUrlQuery({ ...urlQuery, sortBy });
    if (urlQuery.sortOrder !== sortOrder)
      setUrlQuery({ ...urlQuery, sortOrder });
    if (urlQuery.filter !== filter) setUrlQuery({ ...urlQuery, filter });

    return new URLSearchParams({ page, sortBy, sortOrder, filter }).toString();
  };
  useEffect(() => {
    if (props.user === "student") {
      setBreadcrumbs([{ component: "Users" }, { component: "Student" }]);
      (async () => {
        setLoading(true);
        const response = await getStudents();
        if (response.success) {
          setStudents(response.data.students);
          setFiltered(response.data.students);
          setPageData({
            ...pageData,
            page: response.data.page,
            totalPages: response.data.totalPages,
          });
          setLoading(false);
        } else {
          toast({
            description: response.error,
            variant: "destructive",
          });
          setLoading(false);
        }
      })();
    } else {
      setBreadcrumbs([{ component: "Users" }, { component: "Recruiter" }]);
      (async () => {
        setLoading(true);
        const response = await getRecruiters();
        if (response.success) {
          setRecruiters(response.data.recruiters);
          setFiltered(response.data.recruiters);
          setPageData({
            ...pageData,
            page: response.data.page,
            totalPages: response.data.totalPages,
          });
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
  }, [props.user]);

  useEffect(() => {
    debouncedSetQuery(search);
  }, [search]);

  useEffect(() => {
    if (props.user === "student") {
      const filteredStudents = students.filter((student) => {
        return (
          student.firstName.toLowerCase().startsWith(search.toLowerCase()) ||
          student.lastName.toLowerCase().startsWith(search.toLowerCase()) ||
          student.email.toLowerCase().startsWith(search.toLowerCase())
        );
      });
      if (filteredStudents.length) setFiltered(filteredStudents);
      else {
        const fetchStudents = async () => {
          setLoading(true);
          const response = await getStudents(
            filteredUrl(
              search,
              urlQuery.page,
              urlQuery.sortBy,
              urlQuery.sortOrder
            )
          );
          if (response.success) {
            setFiltered(response.data.students);
            setPageData({
              ...pageData,
              page: response.data.page,
              totalPages: response.data.totalPages,
            });
            setLoading(false);
          } else {
            toast({
              description: response.error,
              variant: "destructive",
            });
            setLoading(false);
          }
        };
        fetchStudents();
      }
    } else {
      const filteredRecruiters = recruiters.filter((recruiter) => {
        return (
          recruiter.companyName
            .toLowerCase()
            .startsWith(search.toLowerCase()) ||
          recruiter.email.toLowerCase().startsWith(search.toLowerCase()) ||
          recruiter.basedAt.toLowerCase().startsWith(search.toLowerCase())
        );
      });
      if (filteredRecruiters.length) setFiltered(filteredRecruiters);
      else {
        const fetchRecruiters = async () => {
          setLoading(true);
          const response = await getRecruiters(
            filteredUrl(
              search,
              urlQuery.page,
              urlQuery.sortBy,
              urlQuery.sortOrder
            )
          );
          if (response.success) {
            setFiltered(response.data.recruiters);
            setPageData({
              ...pageData,
              page: response.data.page,
              totalPages: response.data.totalPages,
            });
            setLoading(false);
          } else {
            toast({
              description: response.error,
              variant: "destructive",
            });
            setLoading(false);
          }
        };
        fetchRecruiters();
      }
    }
  }, [query]);

  const sort = async (sortBy: string) => {
    let sortOrder = urlQuery.sortOrder;
    if (urlQuery.sortBy !== sortBy) {
      sortOrder = "1";
    } else {
      if (urlQuery.sortOrder === "1") {
        sortOrder = "-1";
      } else {
        sortOrder = "1";
      }
    }
    if (props.user === "student") {
      setLoading(true);
      const response = await getStudents(
        filteredUrl(urlQuery.filter, urlQuery.page, sortBy, sortOrder)
      );
      if (response.success) {
        setFiltered(response.data.students);
        setLoading(false);
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
        setLoading(false);
      }
    } else {
      setLoading(true);
      const response = await getRecruiters(
        filteredUrl(urlQuery.filter, urlQuery.page, sortBy, sortOrder)
      );
      if (response.success) {
        setFiltered(response.data.recruiters);
        setLoading(false);
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };

  const blockUser = async (userId: string, block: boolean) => {
    const response = await blockAction(userId, block);
    if (response.success) {
      let users = filtered;
      users = users.map((user) => {
        if (user._id == userId) {
          user.status = block ? "blocked" : "active";
        }
        return user;
      }) as StudentData[] | RecruiterData[];
      setFiltered(users);
      users = props.user === "student" ? students : recruiters;
      users = users.map((user) => {
        if (user._id == userId) {
          user.status = block ? "blocked" : "active";
        }
        return user;
      }) as StudentData[] | RecruiterData[];
      if (props.user === "student") {
        setStudents(users as StudentData[]);
      } else {
        setRecruiters(users as RecruiterData[]);
      }
      toast({
        description: response.data.message,
      });
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
    }
  };

  const blockUserAlert = (userId: string, block: boolean) => {
    setAlertData({
      open: true,
      userId,
      block,
      blockUser,
    });
  };

  const [alerData, setAlertData] = useState({
    open: false,
    userId: "",
    block: true,
    blockUser: blockUser,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [studentProfile, setStudentProfile] = useState<StudentData | null>(
    null
  );
  const [recruiterProfile, setRecruiterProfile] =
    useState<RecruiterData | null>(null);

  const viewProfile = (userId: string) => {
    if (props.user === "student") {
      setStudentProfile(
        filtered.find((user) => user._id === userId) as StudentData
      );
    } else {
      setRecruiterProfile(
        filtered.find((user) => user._id === userId) as RecruiterData
      );
    }
    setDrawerOpen(true);
  };

  const setPage = useCallback(
    async (page: number, user: "student" | "recruiter") => {
      setLoading(true);

      const url = filteredUrl(
        urlQuery.filter,
        String(page),
        urlQuery.sortBy,
        urlQuery.sortOrder
      );

      const response =
        user === "student"
          ? await getStudents(url)
          : await getRecruiters(url);

      if (response.success) {
        if (user === "student") setStudents(response.data.students);
        else setRecruiters(response.data.recruiters);

        setFiltered(response.data.students || response.data.recruiters);
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
    [props.user, urlQuery]
  )

  const [pageData, setPageData] = useState({ page: 1, totalPages: 1, setPage });
  return (
    <div className="flex h-10">
      <AlertDialog open={alerData.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will block the particular user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setAlertData({ ...alerData, open: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alerData.blockUser(alerData.userId, alerData.block);
                setAlertData({ ...alerData, open: false });
              }}
            >
              {alerData.block ? "Block" : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          {props.user === "student"
            ? studentProfile && (
                <div className="flex flex-col items-center gap-4 pt-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={studentProfile.profilePicture || defaultPic}
                      alt="Profile Image"
                    />
                    <AvatarFallback>
                      <Skeleton className="w-24 h-24 rounded-full" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      {(
                        studentProfile.firstName +
                        " " +
                        studentProfile.lastName
                      ).length <= 30
                        ? studentProfile.firstName +
                          " " +
                          studentProfile.lastName
                        : (
                            studentProfile.firstName +
                            " " +
                            studentProfile.lastName
                          ).slice(0, 30) + "..."}
                    </h2>
                    <Badge
                      variant={
                        studentProfile.status === "active"
                          ? "default"
                          : "destructive"
                      }
                      className="mt-2"
                    >
                      {studentProfile.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-20 w-full p-6 border rounded-lg shadow-sm max-w-xl">
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Email</span>
                      <span className="font-medium">
                        {studentProfile.email.length <= 18
                          ? studentProfile.email
                          : studentProfile.email.slice(0, 18) + "..."}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">LinkedIn</span>
                      {studentProfile.linkedinProfile ? (
                        <a
                          href={studentProfile.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 flex items-center gap-1"
                        >
                          {" "}
                          View Profile
                        </a>
                      ) : (
                        "Not Added"
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">GitHub</span>
                      {studentProfile.githubProfile ? (
                        <a
                          href={studentProfile.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 flex items-center gap-1"
                        >
                          {" "}
                          View Profile
                        </a>
                      ) : (
                        "Not Added"
                      )}
                    </div>
                  </div>
                </div>
              )
            : recruiterProfile && (
                <div className="flex flex-col items-center gap-4 pt-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={recruiterProfile.profilePicture || defaultPic}
                      alt="Profile Image"
                    />
                    <AvatarFallback>
                      <Skeleton className="w-24 h-24 rounded-full" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      {recruiterProfile.companyName.length <= 30
                        ? recruiterProfile.companyName
                        : recruiterProfile.companyName.slice(0, 30) + "..."}
                    </h2>
                    <span className="font-sm">
                      {recruiterProfile.email.length <= 25
                        ? recruiterProfile.email
                        : recruiterProfile.email.slice(0, 25) + "..."}
                    </span>
                  </div>
                  <Badge
                    variant={
                      recruiterProfile.status === "active"
                        ? "default"
                        : "destructive"
                    }
                    className="mt-2"
                  >
                    {recruiterProfile.status}
                  </Badge>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full p-6 border rounded-lg shadow-sm max-w-3xl">
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">LinkedIn</span>
                      {recruiterProfile.linkedinProfile ? (
                        <a
                          href={recruiterProfile.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 flex items-center gap-1"
                        >
                          {" "}
                          View Profile
                        </a>
                      ) : (
                        "Not Added"
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Facebook</span>
                      {recruiterProfile.facebookProfile ? (
                        <a
                          href={recruiterProfile.facebookProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 flex items-center gap-1"
                        >
                          {" "}
                          View Profile
                        </a>
                      ) : (
                        "Not Added"
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Twitter</span>
                      {recruiterProfile.twitterProfile ? (
                        <a
                          href={recruiterProfile.twitterProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 flex items-center gap-1"
                        >
                          {" "}
                          View Profile
                        </a>
                      ) : (
                        "Not Added"
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Based At</span>
                      {recruiterProfile.basedAt === ""
                        ? "Not Added"
                        : recruiterProfile.basedAt}
                    </div>
                    <div className="flex flex-col col-span-full">
                      <span className="text-gray-600 text-sm">Bio</span>
                      <ScrollArea className="h-24">
                        {recruiterProfile.bio === ""
                          ? "Not Added"
                          : recruiterProfile.bio}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              )}

          <DrawerFooter className="flex justify-between px-6 py-4">
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DataTable
        data={filtered}
        user={props.user}
        loading={loading}
        search={search}
        setSearch={setSearch}
        sort={sort}
        blockUser={blockUserAlert}
        viewProfile={viewProfile}
        pageData={pageData}
      />
    </div>
  );
};

export default Users;
