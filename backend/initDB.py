import pymysql
from args import parser

args = parser.parse_args()

db = pymysql.connect(host=args.db_host, port=args.db_port,
                     user=args.db_user, passwd=args.db_password, db=args.db_name)

cursor = db.cursor()

try:
    sql1 = """
        create table user(
            id int primary key auto_increment,
            username varchar(32) not null,
            password varchar(32) not null,
            nickname varchar(32) not null,
            avatar varchar(256) not null,
            phone varchar(32) not null,
            admin int not null default 0
        );
        """
    cursor.execute(sql1)

    sql2 = """
        create table city(
            id int primary key auto_increment,
            name varchar(32) not null
        );
    """
    cursor.execute(sql2)

    sql3 = """
        create table data(
            city_id int not null,
            date date not null,
            hour int not null,
            pm25 int not null,
            pm10 int not null,
            so2 int not null,
            no2 int not null,
            co int not null,
            o3 int not null,
            primary key(city_id, date, hour),
            foreign key(city_id) references city(id)
        );
    """
    cursor.execute(sql3)

    sql4 = """
        create table favorite(
            user_id int not null,
            city_id int not null,
            primary key(user_id, city_id),
            foreign key(user_id) references user(id),
            foreign key(city_id) references city(id)
        );
    """
    cursor.execute(sql4)

except Exception as e:
    print(e)
    db.rollback()
