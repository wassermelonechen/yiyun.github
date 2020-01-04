import sqlite3

# whiting for change Stub
class Stub:
    def __init__(self, conn_url, type, q):
        self.q = q
        self.type = type
        self.q_values = tuple()
        self.conn_url = conn_url

    def set(self, **kargs):
        if self.type != "UPDATE":
            raise Exception("Can not use 'SET' on a '{}' command".format(self.type))
        sets = ["{} = ?".format(x) for x in kargs]
        if (len(sets) > 0):
            self.q += " SET {}".format(", ".join(sets))
        self.q_values += tuple(kargs.values())
        return self

    def where(self, **kargs):
        search_params = ["{} = ?".format(x) for x in kargs]
        if (len(search_params) > 0):
            self.q += " WHERE {}".format(" AND ".join(search_params))
        self.q_values += tuple(kargs.values())
        return self

    def where_2(self, **kargs):
        search_params = ["{} like ?".format(x) for x in kargs]
        if (len(search_params) > 0):
            self.q += " WHERE {}".format(" AND ".join(search_params))
        self.q_values += tuple(kargs.values())
        return self
    def with_values(self, **kargs):
        keys = ",".join(kargs.keys())
        values = [kargs[k] for k in kargs.keys()]
        ph = ",".join(["?" for k in kargs.keys()])
        self.q += "({}) VALUES({})".format(keys,ph);
        self.q_values += tuple(values)
        return self
    def limit(self, n):
        self.q += " LIMIT "+n
        return self
    def execute(self):
        conn = sqlite3.connect(self.conn_url)
        c = conn.cursor()
        # since the last python update we can now
        # assume kargs are ordered :D
        #print(self.q)
        #print(self.q_values)
        c.execute(self.q,self.q_values)
        if (self.type == "EXISTS"):
            r = (c.fetchone() != None)
            conn.close()
            return r
        elif (self.type == "UPDATE" or self.type == "INSERT" or self.type == "DELETE"):
            conn.commit()
            r = c.lastrowid
            conn.close()
            return r
        elif (self.type == "SELECT"):
            r = c.fetchone()
            conn.close()
            return r
        elif (self.type == "SELECT_ALL"):
            r = c.fetchall()
            conn.close()
            return r
        raise Exception("Unknown Stub type '{}'".format(self.type))

    def __bool__(self):
        if (self.type == "EXISTS"):
            return self.execute()
        return True

class DB:
    def __init__(self):
        self.conn_url = "db/luna.sqlite3"
        self.exist_queries = {
            "STUDENTS" : "SELECT ID FROM STUDENTS",
            "USERS": "SELECT ID FROM USERS",
            "COURSES": "SELECT ID FROM COURSES",
            "ANNOUNCEMENTS": "SELECT ID FROM ANNOUNCEMENTS",

            "CONSULTATIONS" : "SELECT ID FROM CONSULTATIONS",
            "COURSEMEMBERS": "SELECT STUDENT,TPYE FROM COURSEMEMBERS",  #why ?????
            "UPCOMING": "SELECT ID FROM UPCOMING",
            "POSTS": "SELECT ID FROM POSTS",

            "COMMENTS": "SELECT ID FROM COMMENTS",
            "COMMENTVOTES": "SELECT COMMENT,USER FROM COMMENTVOTES",
            "POSTVOTES": "SELECT POST,USER FROM POSTVOTES",
        }
        self.update_queries = {
            "STUDENTS" : "UPDATE STUDENTS",
            "USERS": "UPDATE USERS",
            "COURSES": "UPDATE COURSES",
            "ANNOUNCEMENTS": "UPDATE ANNOUNCEMENTS",

            "CONSULTATIONS" : "UPDATE CONSULTATIONS",
            "COURSEMEMBERS": "UPDATE COURSEMEMBERS",
            "UPCOMING": "UPDATE UPCOMING",
            "POSTS": "UPDATE POSTS",

            "COMMENTS": "UPDATE COMMENTS",
            "COMMENTVOTES": "UPDATE COMMENTVOTES",
            "POSTVOTES": "UPDATE POSTVOTES",

        }

        self.select_queries = {
            "STUDENTS" : "SELECT * FROM STUDENTS",
            "USERS" : "SELECT * FROM USERS",
            "COURSES": "SELECT * FROM COURSES",
            "ANNOUNCEMENTS" : "SELECT * FROM ANNOUNCEMENTS",
            "CONSULTATIONS" : "SELECT * FROM CONSULTATIONS",
            "COURSEMEMBERS" : "SELECT * FROM COURSEMEMBERS",
            "COURSEMEMBERS_COURSE" : "SELECT COURSE FROM COURSEMEMBERS",
            "UPCOMING" : "SELECT * FROM UPCOMING",
            "POST_me": "SELECT * FROM POSTS",
            "POSTS" : '''SELECT * FROM (
                SELECT T2.*, COUNT(C.Id)
                FROM (
                    SELECT T.*, COUNT(PV.User)
                    FROM (
                        SELECT CM.Student, CM.Type, P.*, U.Nickname
                        FROM CourseMembers AS CM, Posts AS P, Users AS U
                        WHERE CM.COURSE=P.COURSE AND P.Poster=U.Id
                    ) AS T
                    LEFT OUTER JOIN PostVotes as PV ON T.Id=PV.Post
                    Group By T.Student, T.Id
                ) AS T2
                LEFT OUTER JOIN Comments as C ON T2.Id=C.Post
                GROUP BY T2.Student, T2.Id
            )''',

            "POSTS_2" : '''SELECT  * FROM (
                SELECT T2.*, COUNT(C.Id)
                FROM (
                    SELECT T.*, COUNT(PV.User)
                    FROM (
                        SELECT CM.Student, CM.Type, P.*, U.Nickname
                        FROM CourseMembers AS CM, Posts AS P, Users AS U
                        WHERE CM.COURSE=P.COURSE AND P.Poster=U.Id
                    ) AS T
                    LEFT OUTER JOIN PostVotes as PV ON T.Id=PV.Post
                    Group By T.Student, T.Id
                ) AS T2
                LEFT OUTER JOIN Comments as C ON T2.Id=C.Post
                GROUP BY T2.Student, T2.Id
            )''',


            "POSTS_TIME":'''SELECT * FROM (
                SELECT T2.*, COUNT(C.Id)
                FROM (
                    SELECT T.*, COUNT(PV.User)
                    FROM (
                        SELECT CM.Student, CM.Type, P.*, U.Nickname
                        FROM CourseMembers AS CM, Posts AS P, Users AS U
                        WHERE CM.COURSE=P.COURSE AND P.Poster=U.Id
                    ) AS T
                    LEFT OUTER JOIN PostVotes as PV ON T.Id=PV.Post
                    Group By T.Student, T.Id
                ) AS T2
                LEFT OUTER JOIN Comments as C ON T2.Id=C.Post
                GROUP BY T2.Student, T2.Id
            )  ''',
            "COMMENTS" : "SELECT * FROM COMMENTS",
            "COMMENTVOTES" : "SELECT * FROM COMMENTVOTES",
            "POSTVOTES" : "SELECT * FROM POSTVOTES"
        }

        self.insert_queries = {

            "STUDENTS" : "INSERT INTO STUDENTS",
            "USERS": "INSERT INTO USERS",
            "COURSES": "INSERT INTO COURSES",
            "ANNOUNCEMENTS": "INSERT INTO ANNOUNCEMENTS",

            "CONSULTATIONS" : "INSERT INTO CONSULTATIONS",
            "COURSEMEMBERS": "INSERT INTO COURSEMEMBERS",
            "UPCOMING": "INSERT INTO UPCOMING",
            "POSTS": "INSERT INTO POSTS",

            "COMMENTS": "INSERT INTO COMMENTS",
            "COMMENTVOTES": "INSERT INTO COMMENTVOTES",
            "POSTVOTES": "INSERT INTO POSTVOTES",
        }
        self.delete_queries = {
            "STUDENTS" : "DELETE FROM STUDENTS",
            "USERS": "DELETE FROM USERS",
            "COURSES": "DELETE FROM COURSES",
            "ANNOUNCEMENTS": "DELETE FROM ANNOUNCEMENTS",

            "CONSULTATIONS" : "DELETE FROM CONSULTATIONS",
            "COURSEMEMBERS": "DELETE FROM COURSEMEMBERS",
            "UPCOMING": "DELETE FROM UPCOMING",
            "POSTS": "DELETE FROM POSTS",

            "COMMENTS": "DELETE FROM COMMENTS",
            "COMMENTVOTES": "DELETE FROM COMMENTVOTES",
            "POSTVOTES": "DELETE FROM POSTVOTES",
        }
    def raw(self, q, params=[]):
        conn = sqlite3.connect(self.conn_url)
        c = conn.cursor()
        c.execute(q,tuple(params))
        r = c.fetchall()
        conn.commit()
        conn.close()
        return r
    def exists(self, query_name, **kargs):

        s = Stub(self.conn_url, "EXISTS", self.exist_queries[query_name])
        return s
    def delete(self, query_name, **kargs):
        s = Stub(self.conn_url, "DELETE", self.delete_queries[query_name])
        return s
    def insert(self, query_name, **kargs):
        s = Stub(self.conn_url, "INSERT", self.insert_queries[query_name])
        return s
    def select(self, query_name, **kargs):
        s = Stub(self.conn_url, "SELECT", self.select_queries[query_name])
        return s
    def select_all(self, query_name, **kargs):
        s = Stub(self.conn_url, "SELECT_ALL", self.select_queries[query_name])
        return s
    def update(self, query_name, **kargs):
        s = Stub(self.conn_url, "UPDATE", self.update_queries[query_name])
        return s
