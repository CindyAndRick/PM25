import requests


def nextdate(y, m, d):
    big = [1, 3, 5, 7, 8, 10, 12]
    small = [4, 6, 9, 11]
    if (m in big and d == 31) or (m in small and d == 30) or (m == 2 and y % 4 == 0 and y % 100 != 0 and d == 29) or (m == 2 and y % 4 != 0 and d == 28):
        if m == 12:
            y = y + 1
            m = 1
            d = 1
        else:
            m = m + 1
            d = 1
    else:
        d = d + 1
    return y, m, d


if __name__ == '__main__':
    y = 2020
    m = 1
    d = 1
    baseUrl = 'https://quotsoft.net/air/data/china_cities_'
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0'}
    while (1):
        url = baseUrl + str(y) + (('0' + str(m)) if m < 10 else str(m)) + \
            (('0' + str(d)) if d < 10 else str(d)) + '.csv'
        r = requests.get(url, headers=headers)

        with open(file='./data{}.csv'.format(str(y)+str(m)+str(d)), mode='w+', encoding='utf-8') as f:
            f.write(r.text)
            f.close()
        break
        y, m, d = nextdate(y, m, d)
        # print(y,m,d)
        # if y == 2020 and m == 4 and d == 18:
        #     break
