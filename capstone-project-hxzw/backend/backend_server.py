#!/usr/bin/env python3

import os, sys, sqlite3


def main(host='127.0.0.1', port=None):
    try:
        create_database()    # 等待部分删除 
        check_database()    # moved
        run(host, port)     # moved
    except ImportError as e:
        print('ERROR:', e, file=sys.stderr)
        if sys.version_info < (3,6):
            print('The backend requires Python 3.6 or later - you appear to be using Python {}.{}'.format(*sys.version_info), file=sys.stderr)
        else:
            print('A module required by the backend is missing.', file=sys.stderr)
            print('See the instructions in backend/README.md for installing the required modules.', file=sys.stderr)
            print('Ask in the forum if you can not fix this problem.', file=sys.stderr)
        sys.exit(1)

def run(host, port):
    if port is not None:
        run1(host, port)
    else:
        for port in range(5000, 5100):
            try:
                run1(host, port)
                break
            except OSError as e:
                if 'Address in use' in str(e):
                    continue

def run1(host, port):
    from app import app
    import namespaces.forum
    import namespaces.auth
    import namespaces.announcements
    import namespaces.consultations
    import namespaces.personal
    import namespaces.upcoming
    import namespaces.comment
    import namespaces.CourseMembers
    import namespaces.CommentVotes
    #import namespaces.user
    #import namespaces.classtable
    os.environ['HOST'] = host
    os.environ['PORT'] = str(port)
    app.run(debug=True, host=host, port=port)

def create_database():    # 等待部分删除 
    database_dir = os.path.join('db')
    database_file = os.path.join(database_dir, 'luna.sqlite3')
    # 两个if的内容可删除，【若指定路径没有文件，则从学校url获取
    if not os.path.exists(database_dir):
        print(' * [DATABASE WIZARD] No db folder was detected, Creating', database_dir)
        os.mkdir(database_dir)
    if not os.path.exists(database_file):
        print(' file [app.py] Cannot delet [DATABASE_URL]')


def check_database():
    database_dir = os.path.join('db')
    database_file = os.path.join(database_dir, 'luna.sqlite3')
    print(' * [DATABASE WIZARD] Checking Database')
    conn = sqlite3.connect(database_file)
    c = conn.cursor()
    # delete something here
    conn.commit()
    c.close()
    conn.close()
    print(' * [DATABASE WIZARD] Database Healthy')

def usage():
    print('Usage:', sys.argv[0], '[host]', '[port]')
    print('or:', sys.argv[0], '[port]')
    print('or:', sys.argv[0])

if __name__ == "__main__":
    try:
        if len(sys.argv) == 3:
            main(host=sys.argv[1], port=int(sys.argv[2]))
        elif len(sys.argv) == 2:
            main(port=int(sys.argv[1]))
        elif len(sys.argv) == 1:
            main()
        else:
            usage()
    except ValueError:
        usage()