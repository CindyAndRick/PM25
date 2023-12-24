import pymysql

db = pymysql.connect(host='xxx.xxx.xxx.xxx', port=xxx, user='xxx', password='xxx', database='xxx')
cursor = db.cursor()

try:
    sql1 = """
        create table user(
            id int primary key auto_increment,
            username varchar(32) not null,
            password varchar(32) not null,
            nickname varchar(32) not null,
            phone varchar(32) not null,
            admin int not null default 0
        );
        """
    cursor.execute(sql1)

    sql2 = """
        create table city(
            id int primary key auto_increment,
            name varchar(32) not null,
            lat varchar(32) not null,
            lng varchar(32) not null            
        );
    """
    cursor.execute(sql2)

    sql3 = """
        create table data(
            city_id int not null,
            date date not null,
            hour int not null,
            aqi float not null,
            pm25 float not null,
            pm10 float not null,
            so2 float not null,
            no2 float not null,
            co float not null,
            o3 float not null,
            predict int not null default 0,
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

    sql5 = """
        create index index_id on user(id);
    """
    cursor.execute(sql5)

    sql6 = """
        create index index_city_id on city(id);
    """
    cursor.execute(sql6)

    sql7 = """
        alter table data add index index_city_date_hour (city_id, date, hour);
    """
    cursor.execute(sql7)

    sql8 = """
        alter table favorite add index index_user_city (user_id, city_id);
    """
    cursor.execute(sql8)

except Exception as e:
    print(e)
    db.rollback()
