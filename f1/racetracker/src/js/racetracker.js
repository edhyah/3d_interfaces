AFRAME.registerComponent('racetracker', {
    init: function () {
        this.track = this.el.sceneEl.querySelector('#trackmodel');
        this.track.object3D.scale.set(0.0005, 0.0005, 0.0005);

        this.car = this.el.sceneEl.querySelector('#carmodel');
        this.car.object3D.position.set(-6, 0.38, 13);
        this.car.object3D.rotation.set(0, -2.27, 0);
        this.car.object3D.scale.set(0.02, 0.02, 0.02);

        // TODO: this needs tweaking
        this.s = [0.002, 0.0007, 0.002]
        this.T = [0, 0, 0];

        this.data = this.getTelemetryDataPerez();
        this.t = 0;
    },

    tick: function (time, timeDelta) {
        if (this.data == null) { return; }
        const position = this.data[this.t % this.data.length];
        const x = this.s[0]*position[2] + this.T[0];
        const y = this.s[1]*position[4] + this.T[1]; // y is elevation in Aframe
        const z = this.s[2]*position[3] + this.T[2];
        this.car.object3D.position.set(x, y, z);
        this.t += 1;
        console.log(this.t);
    },

    getTelemetryData: function () {
        return [
        ];
    },

    getTelemetryDataPerez: function () {
        return [
            [0, '11', -7261, -7408, 516, 'red'],
            [200, '11', -7261, -7408, 516, 'red'],
            [460, '11', -7261, -7408, 516, 'red'],
            [740, '11', -7261, -7408, 516, 'red'],
            [1140, '11', -7261, -7408, 516, 'red'],
            [1460, '11', -7261, -7408, 516, 'red'],
            [1779, '11', -7261, -7408, 516, 'red'],
            [2059, '11', -7261, -7408, 516, 'red'],
            [2279, '11', -7261, -7408, 516, 'red'],
            [2439, '11', -7261, -7408, 516, 'red'],
            [2679, '11', -7261, -7408, 516, 'red'],
            [2919, '11', -7261, -7408, 516, 'red'],
            [3259, '11', -7261, -7408, 516, 'red'],
            [3659, '11', -7261, -7408, 516, 'red'],
            [4800, '11', -7261, -7408, 516, 'red'],
            [5100, '11', -7261, -7408, 516, 'red'],
            [5360, '11', -7261, -7408, 516, 'red'],
            [5600, '11', -7261, -7408, 516, 'red'],
            [5860, '11', -7261, -7408, 516, 'red'],
            [6220, '11', -7261, -7408, 516, 'red'],
            [6400, '11', -7261, -7408, 516, 'red'],
            [6620, '11', -7262, -7407, 516, 'red'],
            [6860, '11', -7263, -7405, 516, 'red'],
            [7120, '11', -7265, -7398, 516, 'red'],
            [7500, '11', -7269, -7387, 516, 'red'],
            [7880, '11', -7272, -7379, 516, 'red'],
            [8020, '11', -7274, -7374, 516, 'red'],
            [8319, '11', -7279, -7361, 516, 'red'],
            [8579, '11', -7286, -7348, 516, 'red'],
            [8739, '11', -7290, -7338, 516, 'red'],
            [8999, '11', -7298, -7320, 516, 'red'],
            [9059, '11', -7300, -7316, 516, 'red'],
            [9259, '11', -7307, -7301, 516, 'red'],
            [9639, '11', -7322, -7266, 516, 'red'],
            [9999, '11', -7336, -7236, 516, 'red'],
            [10119, '11', -7342, -7225, 516, 'red'],
            [10459, '11', -7364, -7183, 516, 'red'],
            [10799, '11', -7377, -7161, 516, 'red'],
            [11060, '11', -7390, -7138, 516, 'red'],
            [11300, '11', -7413, -7096, 516, 'red'],
            [11720, '11', -7428, -7064, 516, 'red'],
            [12000, '11', -7441, -7034, 516, 'red'],
            [12040, '11', -7443, -7029, 516, 'red'],
            [12280, '11', -7454, -7002, 516, 'red'],
            [12560, '11', -7465, -6969, 516, 'red'],
            [12760, '11', -7472, -6946, 516, 'red'],
            [12980, '11', -7480, -6921, 516, 'red'],
            [13140, '11', -7485, -6903, 516, 'red'],
            [13440, '11', -7497, -6863, 516, 'red'],
            [13760, '11', -7504, -6839, 516, 'red'],
            [14020, '11', -7511, -6812, 516, 'red'],
            [14240, '11', -7521, -6781, 516, 'red'],
            [14540, '11', -7528, -6763, 516, 'red'],
            [14879, '11', -7541, -6730, 516, 'red'],
            [15119, '11', -7551, -6708, 516, 'red'],
            [15219, '11', -7555, -6699, 516, 'red'],
            [15379, '11', -7561, -6684, 516, 'red'],
            [15619, '11', -7570, -6662, 516, 'red'],
            [15939, '11', -7586, -6625, 516, 'red'],
            [16259, '11', -7592, -6608, 516, 'red'],
            [16499, '11', -7600, -6588, 516, 'red'],
            [16759, '11', -7610, -6553, 516, 'red'],
            [17079, '11', -7615, -6533, 516, 'red'],
            [17199, '11', -7617, -6520, 516, 'red'],
            [17440, '11', -7621, -6493, 516, 'red'],
            [17740, '11', -7625, -6455, 516, 'red'],
            [17980, '11', -7628, -6422, 516, 'red'],
            [18200, '11', -7631, -6390, 516, 'red'],
            [18380, '11', -7633, -6361, 516, 'red'],
            [18560, '11', -7635, -6332, 516, 'red'],
            [18800, '11', -7637, -6290, 516, 'red'],
            [18980, '11', -7639, -6258, 516, 'red'],
            [19280, '11', -7642, -6201, 516, 'red'],
            [19460, '11', -7642, -6165, 516, 'red'],
            [19620, '11', -7642, -6111, 516, 'red'],
            [20000, '11', -7639, -6049, 516, 'red'],
            [20160, '11', -7637, -6013, 516, 'red'],
            [20480, '11', -7630, -5935, 516, 'red'],
            [20680, '11', -7626, -5883, 516, 'red'],
            [20960, '11', -7619, -5808, 516, 'red'],
            [21180, '11', -7613, -5747, 516, 'red'],
            [21240, '11', -7611, -5730, 516, 'red'],
            [21559, '11', -7592, -5603, 516, 'red'],
            [21939, '11', -7568, -5488, 516, 'red'],
            [22399, '11', -7549, -5407, 516, 'red'],
            [22619, '11', -7536, -5356, 516, 'red'],
            [22819, '11', -7518, -5303, 516, 'red'],
            [23199, '11', -7495, -5240, 516, 'red'],
            [23479, '11', -7472, -5182, 516, 'red'],
            [23759, '11', -7452, -5135, 516, 'red'],
            [23919, '11', -7439, -5108, 516, 'red'],
            [24280, '11', -7423, -5074, 516, 'red'],
            [24480, '11', -7423, -5074, 516, 'red'],
            [24640, '11', -7423, -5074, 516, 'red'],
            [24940, '11', -7423, -5074, 516, 'red'],
            [25100, '11', -7423, -5074, 516, 'red'],
            [25260, '11', -7423, -5074, 516, 'red'],
            [25420, '11', -7423, -5074, 516, 'red'],
            [25740, '11', -7423, -5074, 516, 'red'],
            [26200, '11', -7423, -5074, 516, 'red'],
            [26360, '11', -7423, -5074, 516, 'red'],
            [26560, '11', -7423, -5074, 516, 'red'],
            [27000, '11', -7423, -5074, 516, 'red'],
            [27200, '11', -7423, -5074, 516, 'red'],
            [27300, '11', -7423, -5074, 516, 'red'],
            [27560, '11', -7303, -4886, 516, 'red'],
            [27800, '11', -7161, -4680, 516, 'red'],
            [28019, '11', -7138, -4663, 516, 'red'],
            [28239, '11', -7114, -4650, 516, 'red'],
            [28339, '11', -7103, -4644, 516, 'red'],
            [28519, '11', -7082, -4635, 516, 'red'],
            [28739, '11', -7018, -4612, 552, 'red'],
            [28999, '11', -6927, -4588, 557, 'red'],
            [29459, '11', -6873, -4584, 561, 'red'],
            [29839, '11', -6841, -4581, 563, 'red'],
            [30099, '11', -6796, -4577, 567, 'red'],
            [30499, '11', -6750, -4573, 570, 'red'],
            [30700, '11', -6711, -4569, 574, 'red'],
            [31060, '11', -6636, -4561, 580, 'red'],
            [31520, '11', -6576, -4553, 585, 'red'],
            [31800, '11', -6496, -4541, 591, 'red'],
            [32040, '11', -6471, -4536, 593, 'red'],
            [32320, '11', -6408, -4525, 599, 'red'],
            [32560, '11', -6322, -4507, 607, 'red'],
            [32880, '11', -6270, -4495, 612, 'red'],
            [33200, '11', -6151, -4467, 622, 'red'],
            [33500, '11', -6090, -4452, 627, 'red'],
            [33760, '11', -6007, -4432, 634, 'red'],
            [34060, '11', -5906, -4407, 644, 'red'],
            [34280, '11', -5828, -4388, 651, 'red'],
            [34320, '11', -5814, -4384, 652, 'red'],
            [34579, '11', -5717, -4360, 661, 'red'],
            [34859, '11', -5577, -4324, 674, 'red'],
            [35239, '11', -5455, -4292, 686, 'red'],
            [35479, '11', -5301, -4255, 701, 'red'],
            [35799, '11', -5212, -4237, 708, 'red'],
            [36059, '11', -5092, -4218, 720, 'red'],
            [36359, '11', -4943, -4204, 733, 'red'],
            [36419, '11', -4912, -4201, 736, 'red'],
            [36779, '11', -4683, -4173, 759, 'red'],
            [37119, '11', -4552, -4138, 770, 'red'],
            [37280, '11', -4482, -4111, 777, 'red'],
            [37560, '11', -4333, -4042, 790, 'red'],
            [38240, '11', -4018, -3889, 817, 'red'],
            [38540, '11', -3858, -3829, 830, 'red'],
            [38820, '11', -3752, -3796, 836, 'red'],
            [38980, '11', -3682, -3778, 842, 'red'],
            [39220, '11', -3580, -3757, 848, 'red'],
            [39520, '11', -3405, -3730, 857, 'red'],
            [39960, '11', -3319, -3719, 859, 'red'],
            [40120, '11', -3263, -3712, 860, 'red'],
            [40420, '11', -3160, -3699, 862, 'red'],
            [40480, '11', -3139, -3697, 863, 'red'],
            [40700, '11', -3064, -3686, 862, 'red'],
            [40980, '11', -2968, -3669, 861, 'red'],
            [41139, '11', -2914, -3657, 861, 'red'],
            [41479, '11', -2810, -3628, 861, 'red'],
            [41579, '11', -2773, -3614, 862, 'red'],
            [41739, '11', -2726, -3595, 862, 'red'],
            [42079, '11', -2609, -3534, 863, 'red'],
            [42379, '11', -2561, -3503, 864, 'red'],
            [42639, '11', -2503, -3459, 864, 'red'],
            [42859, '11', -2459, -3419, 865, 'red'],
            [43099, '11', -2416, -3373, 866, 'red'],
            [43339, '11', -2377, -3323, 866, 'red'],
            [43459, '11', -2360, -3297, 866, 'red'],
            [43740, '11', -2327, -3237, 867, 'red'],
            [43900, '11', -2310, -3199, 868, 'red'],
            [44060, '11', -2295, -3155, 868, 'red'],
            [44400, '11', -2265, -2994, 871, 'red'],
            [44540, '11', -2265, -2920, 872, 'red'],
            [44920, '11', -2269, -2860, 873, 'red'],
            [45100, '11', -2276, -2815, 873, 'red'],
            [45320, '11', -2287, -2763, 874, 'red'],
            [45680, '11', -2321, -2657, 881, 'red'],
            [46080, '11', -2356, -2579, 884, 'red'],
            [46380, '11', -2381, -2532, 884, 'red'],
            [46720, '11', -2429, -2454, 885, 'red'],
            [47020, '11', -2458, -2412, 886, 'red'],
            [47360, '11', -2515, -2338, 885, 'red'],
            [47719, '11', -2539, -2308, 885, 'red'],
            [47939, '11', -2563, -2279, 885, 'red'],
            [48099, '11', -2579, -2259, 885, 'red'],
            [48259, '11', -2597, -2238, 885, 'red'],
            [48439, '11', -2617, -2212, 885, 'red'],
            [48779, '11', -2667, -2144, 886, 'red'],
            [49199, '11', -2706, -2078, 887, 'red'],
            [49619, '11', -2728, -2027, 889, 'red'],
            [49819, '11', -2737, -1993, 891, 'red'],
            [50059, '11', -2743, -1951, 893, 'red'],
            [50219, '11', -2745, -1923, 893, 'red'],
            [50400, '11', -2743, -1891, 893, 'red'],
            [50660, '11', -2737, -1844, 895, 'red'],
            [50860, '11', -2722, -1784, 895, 'red'],
            [51280, '11', -2697, -1718, 895, 'red'],
            [51700, '11', -2676, -1672, 893, 'red'],
            [51860, '11', -2665, -1649, 891, 'red'],
            [52020, '11', -2652, -1627, 889, 'red'],
            [52220, '11', -2636, -1599, 887, 'red'],
            [52460, '11', -2616, -1567, 885, 'red'],
            [52740, '11', -2614, -1563, 884, 'red'],
            [52980, '11', -2583, -1517, 880, 'red'],
            [53380, '11', -2560, -1485, 876, 'red'],
            [53540, '11', -2544, -1465, 874, 'red'],
            [53840, '11', -2508, -1420, 869, 'red'],
            [54120, '11', -2483, -1390, 867, 'red'],
            [54479, '11', -2436, -1336, 862, 'red'],
            [54639, '11', -2399, -1296, 859, 'red'],
            [54999, '11', -2360, -1252, 854, 'red'],
            [55179, '11', -2331, -1220, 851, 'red'],
            [55499, '11', -2255, -1131, 843, 'red'],
            [55919, '11', -2182, -1036, 833, 'red'],
            [56359, '11', -2091, -906, 821, 'red'],
            [56759, '11', -2042, -834, 814, 'red'],
            [56940, '11', -2010, -786, 809, 'red'],
            [57180, '11', -1968, -726, 804, 'red'],
            [57360, '11', -1927, -671, 799, 'red'],
            [57600, '11', -1889, -620, 794, 'red'],
            [57800, '11', -1859, -582, 790, 'red'],
            [57960, '11', -1823, -537, 787, 'red'],
            [58340, '11', -1785, -490, 782, 'red'],
            [58580, '11', -1752, -449, 778, 'red'],
            [58740, '11', -1729, -422, 776, 'red'],
            [59040, '11', -1688, -374, 772, 'red'],
            [59240, '11', -1661, -344, 769, 'red'],
            [59400, '11', -1643, -324, 767, 'red'],
            [59640, '11', -1612, -292, 763, 'red'],
            [59800, '11', -1591, -272, 760, 'red'],
            [60100, '11', -1553, -239, 755, 'red'],
            [60320, '11', -1502, -209, 753, 'red'],
            [60740, '11', -1461, -200, 750, 'red'],
            [60859, '11', -1443, -199, 748, 'red'],
            [61119, '11', -1393, -208, 742, 'red'],
            [61379, '11', -1367, -218, 741, 'red'],
            [61739, '11', -1322, -246, 735, 'red'],
            [61839, '11', -1310, -255, 734, 'red'],
            [61999, '11', -1293, -271, 731, 'red'],
            [62379, '11', -1261, -315, 727, 'red'],
            [62539, '11', -1250, -335, 726, 'red'],
            [62779, '11', -1237, -368, 723, 'red'],
            [62999, '11', -1227, -400, 722, 'red'],
            [63199, '11', -1219, -431, 720, 'red'],
            [63439, '11', -1207, -477, 716, 'red'],
            [63760, '11', -1195, -521, 712, 'red'],
            [64080, '11', -1172, -602, 705, 'red'],
            [64380, '11', -1158, -643, 701, 'red'],
            [64540, '11', -1147, -676, 699, 'red'],
            [64740, '11', -1131, -720, 695, 'red'],
            [65040, '11', -1093, -811, 689, 'red'],
            [65500, '11', -1039, -918, 681, 'red'],
            [65860, '11', -1020, -952, 677, 'red'],
            [66020, '11', -1003, -979, 675, 'red'],
            [66220, '11', -981, -1010, 673, 'red'],
            [66460, '11', -954, -1044, 670, 'red'],
            [66740, '11', -912, -1084, 666, 'red'],
            [67180, '11', -855, -1120, 661, 'red'],
            [67439, '11', -834, -1127, 660, 'red'],
            [67719, '11', -797, -1131, 658, 'red'],
            [67959, '11', -769, -1123, 657, 'red'],
            [68059, '11', -759, -1117, 655, 'red'],
            [68359, '11', -739, -1089, 656, 'red'],
            [68599, '11', -733, -1062, 654, 'red'],
            [68839, '11', -733, -1035, 652, 'red'],
            [69039, '11', -736, -1013, 649, 'red'],
            [69239, '11', -742, -986, 645, 'red'],
            [69519, '11', -750, -965, 644, 'red'],
            [69719, '11', -757, -947, 643, 'red'],
            [69999, '11', -769, -924, 641, 'red'],
            [70180, '11', -777, -911, 640, 'red'],
            [70500, '11', -791, -889, 637, 'red'],
            [70720, '11', -807, -869, 635, 'red'],
            [71060, '11', -826, -847, 632, 'red'],
            [71360, '11', -837, -834, 631, 'red'],
            [71600, '11', -851, -819, 627, 'red'],
            [71900, '11', -870, -799, 627, 'red'],
            [72180, '11', -889, -779, 623, 'red'],
            [72380, '11', -905, -763, 621, 'red'],
            [72580, '11', -905, -764, 623, 'red'],
            [72800, '11', -909, -759, 621, 'red'],
            [72980, '11', -927, -740, 618, 'red'],
            [73120, '11', -955, -709, 616, 'red'],
            [73540, '11', -984, -671, 612, 'red'],
            [73700, '11', -997, -650, 610, 'red'],
            [73939, '11', -1012, -620, 608, 'red'],
            [74099, '11', -1019, -599, 608, 'red'],
            [74499, '11', -1027, -548, 606, 'red'],
            [74699, '11', -1025, -520, 605, 'red'],
            [75059, '11', -1016, -479, 600, 'red'],
            [75259, '11', -1000, -444, 597, 'red'],
            [75759, '11', -964, -398, 591, 'red'],
            [76079, '11', -940, -377, 589, 'red'],
            [76339, '11', -916, -359, 588, 'red'],
            [76559, '11', -896, -346, 583, 'red'],
            [76800, '11', -862, -326, 580, 'red'],
            [77080, '11', -846, -318, 578, 'red'],
            [77320, '11', -819, -304, 576, 'red'],
            [77480, '11', -803, -297, 573, 'red'],
            [77700, '11', -774, -283, 571, 'red'],
            [77980, '11', -734, -266, 568, 'red'],
            [78060, '11', -721, -261, 567, 'red'],
            [78440, '11', -655, -238, 562, 'red'],
            [78600, '11', -611, -224, 560, 'red'],
            [78960, '11', -537, -206, 556, 'red'],
            [79380, '11', -487, -198, 555, 'red'],
            [79640, '11', -426, -194, 552, 'red'],
            [80080, '11', -375, -198, 550, 'red'],
            [80140, '11', -366, -199, 549, 'red'],
            [80440, '11', -314, -219, 547, 'red'],
            [80859, '11', -281, -244, 546, 'red'],
            [81119, '11', -260, -271, 546, 'red'],
            [81299, '11', -250, -290, 546, 'red'],
            [81539, '11', -236, -322, 545, 'red'],
            [81739, '11', -225, -362, 545, 'red'],
            [81979, '11', -222, -378, 545, 'red'],
            [82279, '11', -216, -417, 545, 'red'],
            [82519, '11', -213, -448, 545, 'red'],
            [82739, '11', -212, -476, 545, 'red'],
            [82979, '11', -211, -515, 545, 'red'],
            [83280, '11', -211, -501, 545, 'red'],
            [83600, '11', -211, -526, 545, 'red'],
            [84060, '11', -211, -567, 545, 'red'],
            [84380, '11', -212, -592, 545, 'red'],
            [84680, '11', -213, -626, 545, 'red'],
            [84860, '11', -214, -647, 545, 'red'],
            [85120, '11', -216, -680, 545, 'red'],
            [85320, '11', -217, -707, 545, 'red'],
            [85560, '11', -220, -742, 545, 'red'],
            [85760, '11', -223, -777, 545, 'red'],
            [86120, '11', -227, -834, 545, 'red'],
            [86320, '11', -231, -870, 545, 'red'],
            [86400, '11', -232, -885, 544, 'red'],
            [86720, '11', -240, -973, 543, 'red'],
            [87159, '11', -246, -1046, 543, 'red'],
            [87399, '11', -252, -1125, 543, 'red'],
            [87799, '11', -258, -1235, 543, 'red'],
            [88219, '11', -263, -1337, 543, 'red'],
            [88459, '11', -267, -1415, 543, 'red'],
            [88659, '11', -272, -1483, 542, 'red'],
            [88819, '11', -282, -1575, 542, 'red'],
            [89279, '11', -304, -1710, 542, 'red'],
            [89479, '11', -331, -1828, 542, 'red'],
            [89860, '11', -364, -1944, 542, 'red'],
            [90020, '11', -385, -2012, 542, 'red'],
            [90220, '11', -412, -2092, 541, 'red'],
            [90360, '11', -437, -2164, 541, 'red'],
            [90720, '11', -500, -2333, 541, 'red'],
            [90880, '11', -531, -2411, 541, 'red'],
            [91040, '11', -563, -2491, 541, 'red'],
            [91200, '11', -598, -2572, 541, 'red'],
            [91400, '11', -643, -2675, 541, 'red'],
            [91640, '11', -703, -2798, 541, 'red'],
            [91940, '11', -817, -2993, 541, 'red'],
            [92380, '11', -999, -3211, 542, 'red'],
            [92720, '11', -1080, -3284, 542, 'red'],
            [92960, '11', -1247, -3404, 542, 'red'],
            [93460, '11', -1422, -3498, 541, 'red'],
            [93639, '11', -1576, -3571, 540, 'red'],
            [94099, '11', -1753, -3656, 540, 'red'],
            [94279, '11', -1843, -3701, 540, 'red'],
            [94479, '11', -1982, -3772, 541, 'red'],
            [94799, '11', -2076, -3820, 541, 'red'],
            [95159, '11', -2239, -3901, 541, 'red'],
            [95559, '11', -2381, -3969, 541, 'red'],
            [95899, '11', -2462, -4006, 542, 'red'],
            [96199, '11', -2566, -4051, 542, 'red'],
            [96440, '11', -2650, -4086, 543, 'red'],
            [96520, '11', -2678, -4097, 543, 'red'],
            [96820, '11', -2813, -4147, 542, 'red'],
            [97200, '11', -2884, -4171, 542, 'red'],
            [97420, '11', -2950, -4193, 542, 'red'],
            [97620, '11', -3034, -4218, 541, 'red'],
            [98040, '11', -3148, -4248, 539, 'red'],
            [98400, '11', -3218, -4265, 537, 'red'],
            [98600, '11', -3279, -4277, 534, 'red'],
            [98920, '11', -3376, -4295, 530, 'red'],
            [99100, '11', -3468, -4310, 526, 'red'],
            [99580, '11', -3594, -4325, 520, 'red'],
            [99900, '11', -3639, -4331, 517, 'red'],
            [100100, '11', -3685, -4335, 515, 'red'],
            [100319, '11', -3743, -4341, 512, 'red'],
            [100619, '11', -3807, -4348, 509, 'red'],
            [100779, '11', -3840, -4352, 507, 'red'],
            [101059, '11', -3903, -4359, 504, 'red'],
            [101399, '11', -3956, -4365, 502, 'red'],
            [101619, '11', -4014, -4374, 500, 'red'],
            [101999, '11', -4062, -4385, 498, 'red'],
            [102179, '11', -4090, -4394, 497, 'red'],
            [102499, '11', -4134, -4419, 494, 'red'],
            [102659, '11', -4155, -4439, 492, 'red'],
            [102819, '11', -4170, -4461, 493, 'red'],
            [103040, '11', -4189, -4494, 492, 'red'],
            [103300, '11', -4219, -4547, 491, 'red'],
            [103580, '11', -4230, -4563, 491, 'red'],
            [103820, '11', -4250, -4588, 490, 'red'],
            [104040, '11', -4269, -4606, 490, 'red'],
            [104220, '11', -4286, -4618, 490, 'red'],
            [104440, '11', -4307, -4629, 490, 'red'],
            [104720, '11', -4333, -4638, 489, 'red'],
            [104900, '11', -4347, -4642, 490, 'red'],
            [105200, '11', -4372, -4646, 490, 'red'],
            [105440, '11', -4391, -4648, 490, 'red'],
            [105560, '11', -4401, -4649, 490, 'red'],
            [105860, '11', -4431, -4649, 490, 'red'],
            [106120, '11', -4446, -4648, 490, 'red'],
            [106480, '11', -4476, -4644, 490, 'red'],
            [106620, '11', -4497, -4640, 490, 'red'],
            [107039, '11', -4525, -4634, 490, 'red'],
            [107219, '11', -4540, -4630, 490, 'red'],
            [107539, '11', -4566, -4624, 490, 'red'],
            [107599, '11', -4571, -4623, 490, 'red'],
            [107919, '11', -4597, -4617, 490, 'red'],
            [108179, '11', -4627, -4610, 489, 'red'],
            [108459, '11', -4644, -4608, 490, 'red'],
            [108639, '11', -4661, -4605, 490, 'red'],
            [108839, '11', -4680, -4603, 490, 'red'],
            [109199, '11', -4727, -4601, 490, 'red'],
            [110200, '11', -4806, -4606, 490, 'red'],
            [110400, '11', -4826, -4608, 489, 'red'],
            [110560, '11', -4843, -4610, 489, 'red'],
            [110780, '11', -4869, -4614, 489, 'red'],
            [110940, '11', -4876, -4615, 489, 'red'],
            [111160, '11', -4904, -4618, 489, 'red'],
            [111400, '11', -4943, -4624, 489, 'red'],
            [111680, '11', -4989, -4631, 489, 'red'],
            [111780, '11', -5007, -4634, 489, 'red'],
            [112100, '11', -5066, -4642, 489, 'red'],
            [112360, '11', -5146, -4654, 489, 'red'],
            [112640, '11', -5188, -4660, 489, 'red'],
            [112900, '11', -5290, -4674, 490, 'red'],
            [113379, '11', -5387, -4686, 490, 'red'],
            [113539, '11', -5435, -4692, 490, 'red'],
            [113679, '11', -5479, -4698, 489, 'red'],
            [113919, '11', -5558, -4707, 489, 'red'],
            [114099, '11', -5621, -4715, 490, 'red'],
            [114439, '11', -5747, -4730, 489, 'red'],
            [114679, '11', -5842, -4740, 489, 'red'],
            [114799, '11', -5941, -4751, 489, 'red'],
            [115199, '11', -6062, -4762, 490, 'red'],
            [115419, '11', -6203, -4775, 490, 'red'],
            [115919, '11', -6367, -4785, 489, 'red'],
            [116280, '11', -6448, -4790, 490, 'red'],
            [116500, '11', -6518, -4795, 490, 'red'],
            [116680, '11', -6578, -4803, 490, 'red'],
            [116900, '11', -6640, -4816, 491, 'red'],
            [117060, '11', -6682, -4829, 490, 'red'],
            [117260, '11', -6733, -4853, 491, 'red'],
            [117440, '11', -6775, -4881, 490, 'red'],
            [117660, '11', -6823, -4920, 489, 'red'],
            [118000, '11', -6889, -4986, 488, 'red'],
            [118180, '11', -6920, -5022, 487, 'red'],
            [118340, '11', -6946, -5056, 486, 'red'],
            [118520, '11', -6975, -5095, 486, 'red'],
            [118760, '11', -7010, -5151, 485, 'red'],
            [118960, '11', -7038, -5199, 485, 'red'],
            [119120, '11', -7060, -5241, 484, 'red'],
            [119280, '11', -7080, -5283, 483, 'red'],
            [119500, '11', -7106, -5346, 483, 'red'],
            [119880, '11', -7144, -5461, 483, 'red'],
            [120059, '11', -7159, -5520, 482, 'red'],
            [120279, '11', -7182, -5626, 482, 'red'],
            [120539, '11', -7195, -5711, 482, 'red'],
            [120799, '11', -7207, -5809, 482, 'red'],
            [120959, '11', -7213, -5871, 482, 'red'],
            [121299, '11', -7219, -6015, 482, 'red'],
            [121699, '11', -7210, -6189, 482, 'red'],
            [121979, '11', -7199, -6245, 482, 'red'],
            [122319, '11', -7143, -6369, 481, 'red'],
            [122619, '11', -7085, -6432, 480, 'red'],
            [122820, '11', -7033, -6489, 480, 'red'],
            [123180, '11', -6960, -6649, 480, 'red'],
            [123420, '11', -6948, -6684, 480, 'red'],
            [123720, '11', -6914, -6787, 480, 'red'],
            [123980, '11', -6886, -6877, 479, 'red'],
            [124080, '11', -6876, -6913, 479, 'red'],
            [124380, '11', -6841, -7043, 479, 'red'],
            [124720, '11', -6819, -7142, 479, 'red'],
            [125000, '11', -6801, -7232, 479, 'red'],
            [125160, '11', -6793, -7282, 479, 'red'],
            [125400, '11', -6782, -7354, 479, 'red'],
            [125640, '11', -6773, -7421, 479, 'red'],
            [125800, '11', -6768, -7463, 479, 'red'],
            [126000, '11', -6762, -7515, 479, 'red'],
            [126240, '11', -6756, -7574, 479, 'red'],
            [126400, '11', -6753, -7613, 479, 'red'],
            [126599, '11', -6749, -7661, 479, 'red'],
            [126759, '11', -6747, -7699, 479, 'red'],
            [126999, '11', -6746, -7755, 479, 'red'],
            [127259, '11', -6747, -7813, 479, 'red'],
            [127499, '11', -6752, -7865, 479, 'red'],
            [127759, '11', -6775, -7935, 479, 'red'],
            [128079, '11', -6804, -7970, 479, 'red'],
            [128259, '11', -6837, -7997, 479, 'red'],
            [128559, '11', -6878, -8048, 479, 'red'],
            [128779, '11', -6894, -8118, 479, 'red'],
            [129079, '11', -6895, -8150, 479, 'red'],
            [129300, '11', -6894, -8194, 479, 'red'],
            [129620, '11', -6885, -8280, 478, 'red'],
            [129920, '11', -6879, -8316, 478, 'red'],
            [130200, '11', -6863, -8392, 477, 'red'],
            [130500, '11', -6850, -8440, 477, 'red'],
            [130780, '11', -6830, -8502, 476, 'red'],
            [130980, '11', -6814, -8547, 475, 'red'],
            [131220, '11', -6787, -8616, 477, 'red'],
            [131500, '11', -6764, -8667, 477, 'red'],
            [131820, '11', -6707, -8776, 477, 'red'],
            [132200, '11', -6647, -8873, 478, 'red'],
            [132480, '11', -6593, -8946, 477, 'red'],
            [132800, '11', -6553, -8994, 477, 'red'],
            [133099, '11', -6490, -9063, 477, 'red'],
            [133459, '11', -6460, -9093, 478, 'red'],
            [133739, '11', -6417, -9133, 478, 'red'],
            [134119, '11', -6376, -9169, 479, 'red'],
            [134359, '11', -6333, -9204, 479, 'red'],
            [134619, '11', -6303, -9229, 478, 'red'],
            [134859, '11', -6266, -9256, 478, 'red'],
            [135139, '11', -6227, -9285, 479, 'red'],
            [135359, '11', -6192, -9310, 480, 'red'],
            [135619, '11', -6157, -9335, 481, 'red'],
            [135840, '11', -6119, -9362, 481, 'red'],
            [136220, '11', -6068, -9400, 482, 'red'],
            [136580, '11', -6033, -9427, 483, 'red'],
            [136920, '11', -6012, -9443, 483, 'red'],
            [137260, '11', -5976, -9476, 484, 'red'],
            [137720, '11', -5941, -9517, 485, 'red'],
            [138140, '11', -5928, -9550, 486, 'red'],
            [138240, '11', -5928, -9562, 486, 'red'],
            [138540, '11', -5938, -9597, 487, 'red'],
            [138800, '11', -5961, -9622, 487, 'red'],
            [138960, '11', -5977, -9635, 487, 'red'],
            [139160, '11', -5997, -9648, 488, 'red'],
            [139340, '11', -6018, -9662, 489, 'red'],
            [139560, '11', -6040, -9677, 491, 'red'],
            [139819, '11', -6067, -9693, 493, 'red'],
            [140019, '11', -6088, -9704, 494, 'red'],
            [140199, '11', -6109, -9712, 495, 'red'],
            [140379, '11', -6132, -9719, 497, 'red'],
            [140639, '11', -6184, -9732, 499, 'red'],
            [141039, '11', -6227, -9741, 501, 'red'],
            [141219, '11', -6257, -9746, 503, 'red'],
            [141539, '11', -6314, -9755, 505, 'red'],
            [141699, '11', -6344, -9759, 507, 'red'],
            [141959, '11', -6395, -9763, 510, 'red'],
            [142179, '11', -6438, -9766, 512, 'red'],
            [142259, '11', -6453, -9767, 512, 'red'],
            [142500, '11', -6500, -9767, 515, 'red'],
            [142820, '11', -6571, -9762, 518, 'red'],
            [143200, '11', -6618, -9753, 520, 'red'],
            [143420, '11', -6655, -9742, 520, 'red'],
            [143820, '11', -6699, -9720, 523, 'red'],
            [144040, '11', -6736, -9687, 519, 'red'],
            [144300, '11', -6746, -9673, 518, 'red'],
            [144660, '11', -6770, -9629, 514, 'red'],
            [144820, '11', -6777, -9609, 513, 'red'],
            [145020, '11', -6785, -9584, 512, 'red'],
            [145220, '11', -6793, -9558, 511, 'red'],
            [145400, '11', -6799, -9534, 511, 'red'],
            [145760, '11', -6810, -9482, 510, 'red'],
            [145960, '11', -6817, -9452, 510, 'red'],
            [146159, '11', -6827, -9408, 508, 'red'],
            [146579, '11', -6846, -9343, 507, 'red'],
            [146739, '11', -6867, -9290, 506, 'red'],
            [147079, '11', -6888, -9246, 506, 'red'],
            [147279, '11', -6911, -9205, 506, 'red'],
            [147579, '11', -6952, -9140, 504, 'red'],
            [147799, '11', -6986, -9090, 503, 'red'],
            [147999, '11', -7043, -9007, 503, 'red'],
            [148399, '11', -7110, -8904, 504, 'red'],
            [148839, '11', -7164, -8807, 504, 'red'],
            [149080, '11', -7200, -8730, 504, 'red'],
            [149240, '11', -7222, -8678, 503, 'red'],
            [149500, '11', -7255, -8593, 503, 'red'],
            [149720, '11', -7293, -8487, 502, 'red'],
            [150140, '11', -7321, -8400, 503, 'red'],
            [150300, '11', -7339, -8343, 503, 'red'],
            [150540, '11', -7363, -8267, 503, 'red'],
            [150740, '11', -7392, -8166, 503, 'red'],
            [151140, '11', -7413, -8093, 503, 'red'],
            [151380, '11', -7438, -8006, 502, 'red'],
            [151680, '11', -7453, -7950, 502, 'red'],
            [151940, '11', -7473, -7876, 502, 'red'],
            [152140, '11', -7491, -7811, 502, 'red'],
            [152440, '11', -7522, -7690, 502, 'red'],
            [152859, '11', -7550, -7576, 502, 'red'],
            [153019, '11', -7561, -7524, 502, 'red'],
            [153239, '11', -7576, -7451, 502, 'red'],
            [153299, '11', -7580, -7431, 503, 'red'],
            [153579, '11', -7596, -7336, 503, 'red'],
            [153779, '11', -7607, -7266, 503, 'red'],
            [153979, '11', -7616, -7193, 503, 'red'],
            [154299, '11', -7628, -7080, 503, 'red'],
            [154499, '11', -7633, -7031, 503, 'red'],
            [154939, '11', -7646, -6868, 502, 'red'],
        ];
    },
});
