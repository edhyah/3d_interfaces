import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import fastf1

render = True

fastf1.Cache.enable_cache('/home/edwardahn/Downloads/tempcache')

session = fastf1.get_session(2022, 'Monaco', 'R')
session.load()

# Get position data for lap 1 for all drivers, sorted by time
drivers = session.drivers
positions = []
for driver in drivers:
    lap = session.laps.pick_driver(driver).iloc[0].get_pos_data()
    pos = lap.loc[:, ['X', 'Y', 'Z', 'SessionTime']]
    pos['Driver'] = driver
    positions.append(pos)

# Concatenate all positions of all drivers and sort by time
positions = pd.concat(positions)
positions.sort_values(by='SessionTime', ascending=True, inplace=True)

def sessionTime2microseconds(sessionTime):
    return sessionTime.seconds * 10**3 + sessionTime.microseconds / 10**3

# Convert timestamps to milliseconds
start_microseconds = sessionTime2microseconds(positions.iloc[0]['SessionTime'])
positions['Milliseconds'] = positions.apply(
    lambda row: int(sessionTime2microseconds(row['SessionTime']) - start_microseconds),
    axis=1)

# Colors for each driver
driver2color = { '11': 'red', '55': 'blue', '1': 'green', '16': 'black',
        '63': 'orange', '4': 'yellow', '14': 'violet', '44': 'gray',
        '77': 'gray', '5': 'gray', '10': 'gray', '31': 'gray', '3': 'gray',
        '18': 'gray', '6': 'gray', '24': 'gray', '22': 'gray', '23': 'gray',
        '47': 'gray', '20': 'gray' }

# Create list concatenating data from the same milliseconds together
# Note: we might lose data on the last millisecond, but doesn't matter for demo
data_by_ms = []
pos = []
prev_ms = -1
for row in positions.iterrows():
    data = row[1]
    ms = data['Milliseconds']
    if prev_ms != ms and prev_ms != -1:
        data_by_ms.append(pos)
        pos = []
    pos.append([ms, data['Driver'], data['X'], data['Y'], data['Z'], driver2color[data['Driver']]])
    prev_ms = ms

# Print preprocessed data to copy to Javascript code
print('[')
for data in data_by_ms:
    for data_driver in data:
        print('\t' + str(data_driver) + ',')
print('];')

# Render data (doesn't respect time)
if render:
    plt.ion()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    plt.axis([-8000, 0, -10000, 0])
    prev_t = 0
    for data in data_by_ms:
        data = np.array(data)
        t = data[0, 0]
        plt.title('Time in milliseconds: %s' % t)
        #time.sleep(0.001 * (t - prev_t))
        prev_t = t
        x = data[:, 2].astype(int)
        y = data[:, 3].astype(int)
        plt.scatter(x, y, c=data[:, 5])
        fig.canvas.draw()
        fig.canvas.flush_events()
    plt.show()

