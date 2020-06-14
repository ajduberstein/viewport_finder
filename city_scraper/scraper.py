import time

import lxml  # noqa
import pandas as pd

BASE_URL = 'https://en.wikipedia.org/wiki/List_of_towns_and_cities_with_100,000_or_more_inhabitants/cityname:_{}'

tables = []

if __name__ == '__main__':
    for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        table = pd.read_html(BASE_URL.format(c))[0]
        tables.append(table)
        time.sleep(0.1)

    df = pd.concat(tables)
    df.to_csv('cities.csv', index=False)
