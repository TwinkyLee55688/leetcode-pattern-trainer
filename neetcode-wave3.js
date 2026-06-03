(() => {
globalThis.neetcodeRecommended=[
{id:"LC 51",title:"N-Queens",pattern:"Backtracking"},
{id:"LC 572",title:"Subtree of Another Tree",pattern:"Tree DFS/BFS"},
{id:"LC 494",title:"Target Sum",pattern:"Dynamic Programming"},
{id:"LC 329",title:"Longest Increasing Path in a Matrix",pattern:"Matrix / DP"},
{id:"LC 778",title:"Swim in Rising Water",pattern:"Binary Search / Dijkstra"},
{id:"LC 787",title:"Cheapest Flights Within K Stops",pattern:"Graph / DP"},
{id:"LC 1851",title:"Minimum Interval to Include Each Query",pattern:"Heap"},
{id:"LC 295",title:"Find Median from Data Stream",pattern:"Heap"},
{id:"LC 355",title:"Design Twitter",pattern:"Design / Heap"},
{id:"LC 2013",title:"Detect Squares",pattern:"Array / HashMap"},
{id:"LC 332",title:"Reconstruct Itinerary",pattern:"Graph"},
{id:"LC 269",title:"Alien Dictionary",pattern:"Graph"}
];
const existing=new Set(problems.map(p=>p.id));
const add=[
{id:"LC 1046",title:"Last Stone Weight",difficulty:"Easy",pattern:"Heap",source:"NeetCode Complement",wave:"Wave 3",prompt:"Given stone weights, repeatedly smash the two heaviest stones and return the last remaining weight, or 0.",signal:"Repeatedly needing the current largest two items points to a max-heap.",hints:["The operation always asks for the two largest stones.","A max-heap gives the largest stone in O(log n).","If the stones differ, push the difference back.","Stop when the heap has zero or one stone."],interviewer:["Why max-heap?","What happens when equal stones collide?","Can sorting work?","Complexity?"],answer:["Push all stones into a max-heap.","Pop the two largest stones each round.","If they are unequal, push their difference.","Return the remaining top or 0."],complexity:"O(n log n) time, O(n) space",code:`int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int y = pq.top(); pq.pop();
        int x = pq.top(); pq.pop();
        if (y != x) pq.push(y - x);
    }
    return pq.empty() ? 0 : pq.top();
}`,followups:["Can sorting simulate it?","What if stones arrive as a stream?","Why not use a min-heap?"],review:"Last Stone Weight is a direct max-heap simulation of repeated best candidates."},
{id:"LC 621",title:"Task Scheduler",difficulty:"Medium",pattern:"Greedy",secondaryPatterns:["Heap"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Given tasks and a cooldown n, return the least number of intervals needed to finish all tasks.",signal:"Cooldown scheduling depends on the most frequent task; use greedy block formula or heap simulation.",hints:["The most frequent task creates the minimum number of blocks.","If max frequency is f, there are f - 1 gaps before the last group.","Each gap needs n slots unless filled by other tasks.","The answer cannot be less than tasks.length."],interviewer:["Why does max frequency dominate?","How do ties affect the formula?","Can you simulate with a heap?","Complexity?"],answer:["Count task frequencies.","Let maxFreq be the largest frequency and maxCount the number of tasks with that frequency.","Minimum frame is (maxFreq - 1) * (n + 1) + maxCount.","Return max(tasks.size(), frame)."],complexity:"O(n) time, O(1) space for 26 uppercase tasks",code:`int leastInterval(vector<char>& tasks, int n) {
    vector<int> cnt(26, 0);
    for (char c : tasks) cnt[c - 'A']++;
    int maxFreq = *max_element(cnt.begin(), cnt.end());
    int maxCount = count(cnt.begin(), cnt.end(), maxFreq);
    int frame = (maxFreq - 1) * (n + 1) + maxCount;
    return max((int)tasks.size(), frame);
}`,followups:["How would you return the actual schedule?","What if task types are not limited to 26?","When is heap simulation easier to explain?"],review:"Task Scheduler is greedy around the task frequency that creates the tightest cooldown frame."},
{id:"LC 973",title:"K Closest Points to Origin",difficulty:"Medium",pattern:"Heap",secondaryPatterns:["Math"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Given points on a plane, return the k closest points to the origin.",signal:"Selecting k smallest distances points to max-heap of size k or quickselect.",hints:["Distance comparison can use x*x + y*y; no square root is needed.","A max-heap of size k keeps the current k closest points.","If heap size exceeds k, remove the farthest kept point.","At the end, heap contents are the answer."],interviewer:["Why avoid sqrt?","Heap vs quickselect?","What if k equals n?","Complexity?"],answer:["Define squared distance.","Push each point into a max-heap ordered by distance.","When heap size exceeds k, pop the farthest point.","Return all points left in the heap."],complexity:"O(n log k) time, O(k) space",code:`vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto dist = [](const vector<int>& p) {
        return p[0] * p[0] + p[1] * p[1];
    };
    priority_queue<pair<int,int>> pq;
    for (int i = 0; i < points.size(); ++i) {
        pq.push({dist(points[i]), i});
        if (pq.size() > k) pq.pop();
    }
    vector<vector<int>> ans;
    while (!pq.empty()) {
        ans.push_back(points[pq.top().second]);
        pq.pop();
    }
    return ans;
}`,followups:["Can quickselect improve average time?","Does output order matter?","How handle very large coordinates?"],review:"K Closest Points is top-k selection by squared distance."},
{id:"LC 981",title:"Time Based Key-Value Store",difficulty:"Medium",pattern:"Binary Search",secondaryPatterns:["Array / HashMap"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Design a time-based key-value store supporting set(key,value,timestamp) and get(key,timestamp), returning the latest value at or before timestamp.",signal:"Per-key sorted timestamps plus floor lookup points to hashmap of arrays and binary search.",hints:["Group records by key.","Timestamps for each key are given in increasing order by set calls.","get needs the largest timestamp <= query timestamp.","Binary search that floor position."],interviewer:["What data structure stores each key?","Why binary search?","What if no timestamp is valid?","What are operation costs?"],answer:["Map key to vector of {timestamp,value}.","Append on set.","For get, binary search the vector for the last timestamp <= query.","Return empty string if none exists."],complexity:"set O(1), get O(log m), O(total sets) space",code:`class TimeMap {
    unordered_map<string, vector<pair<int,string>>> mp;
public:
    TimeMap() {}
    
    void set(string key, string value, int timestamp) {
        mp[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        auto& arr = mp[key];
        int l = 0, r = arr.size() - 1, ans = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (arr[mid].first <= timestamp) {
                ans = mid;
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return ans == -1 ? "" : arr[ans].second;
    }
};`,followups:["What if set timestamps are not increasing?","Can you use upper_bound?","How would expiration change the design?"],review:"TimeMap is floor binary search inside each key's timestamp history."},
{id:"LC 703",title:"Kth Largest Element in a Stream",difficulty:"Easy",pattern:"Heap",source:"NeetCode Complement",wave:"Wave 3",prompt:"Design a class that returns the kth largest element after each added value.",signal:"Streaming kth largest means keep exactly k largest seen so far in a min-heap.",hints:["A min-heap of size k keeps the k largest values.","The heap top is the kth largest.","Push every new value.","If size exceeds k, pop the smallest kept value."],interviewer:["Why min-heap instead of max-heap?","What does heap.top represent?","How do duplicates behave?","Complexity?"],answer:["Store k.","Initialize by adding all nums through the same helper logic.","On add, push val and shrink heap to size k.","Return heap.top()."],complexity:"Constructor O(n log k), add O(log k), O(k) space",code:`class KthLargest {
    int k;
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int x : nums) add(x);
    }
    
    int add(int val) {
        pq.push(val);
        if (pq.size() > k) pq.pop();
        return pq.top();
    }
};`,followups:["What if k changes dynamically?","How would you support deleting old stream values?","Why does top equal kth largest?"],review:"KthLargest keeps a size-k min-heap; the smallest kept element is the kth largest overall."},
{id:"LC 287",title:"Find the Duplicate Number",difficulty:"Medium",pattern:"Linked List",secondaryPatterns:["Binary Search"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Given nums containing n + 1 integers in [1, n], return the repeated number without modifying nums and using O(1) extra space.",signal:"Values point to indices, forming a functional graph cycle; duplicate is the cycle entrance.",hints:["Treat nums[i] as the next pointer from index i.","A duplicate value creates a cycle entrance.","Use Floyd slow/fast to detect the cycle.","Reset one pointer to start to find the entrance."],interviewer:["Why is this like linked list cycle?","Why does duplicate become cycle entrance?","Can binary search on value work?","Complexity?"],answer:["Run slow = nums[slow], fast = nums[nums[fast]] until they meet.","Reset slow to 0.","Move both one step until they meet again.","Return the meeting value."],complexity:"O(n) time, O(1) space",code:`int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,followups:["Can you solve by binary search on value range?","What if modifying nums is allowed?","Why not use xor?"],review:"Find Duplicate Number maps array values into a cycle-detection problem."},
{id:"LC 846",title:"Hand of Straights",difficulty:"Medium",pattern:"Greedy",secondaryPatterns:["Array / HashMap"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Given a hand of cards, determine if it can be rearranged into groups of groupSize consecutive cards.",signal:"Consecutive grouping with counts means always start groups from the smallest remaining card.",hints:["If total cards is not divisible by groupSize, return false.","Count card frequencies.","Process card values in increasing order.","Whenever count[x] remains, consume that many groups from x through x+groupSize-1."],interviewer:["Why start from the smallest card?","How do duplicates affect grouping?","What data structure keeps order?","Complexity?"],answer:["Count frequencies in an ordered map.","For each card value from smallest to largest, let need=count[value].","Subtract need from each next groupSize value.","If any count becomes negative or missing, return false."],complexity:"O(n log n + n * groupSize in map operations) time, O(n) space",code:`bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize) return false;
    map<int,int> cnt;
    for (int x : hand) cnt[x]++;
    for (auto [x, c] : cnt) {
        if (c == 0) continue;
        for (int v = x; v < x + groupSize; ++v) {
            if (cnt[v] < c) return false;
            cnt[v] -= c;
        }
    }
    return true;
}`,followups:["Can you do it with sorting and hashmap?","What if groupSize is 1?","Why not start from arbitrary cards?"],review:"Hand of Straights is greedy because the smallest remaining card has only one possible group start."},
{id:"LC 853",title:"Car Fleet",difficulty:"Medium",pattern:"Stack",secondaryPatterns:["Greedy"],source:"NeetCode Complement",wave:"Wave 3",prompt:"Given cars with positions and speeds, return the number of fleets that reach the target.",signal:"Cars sorted by position and merged by arrival time point to a monotonic stack or reverse greedy scan.",hints:["Sort cars by position.","A car behind catches a fleet if its arrival time is less than or equal to the fleet ahead.","Scan from closest to target backward.","Each strictly larger arrival time starts a new fleet."],interviewer:["Why sort by position?","Why scan from right to left?","When do fleets merge?","Complexity?"],answer:["Pair each car's position with its arrival time.","Sort by position ascending.","Scan from the end, tracking the slowest arrival time ahead.","If current time is greater than that time, it forms a new fleet."],complexity:"O(n log n) time, O(n) space for pairs",code:`int carFleet(int target, vector<int>& position, vector<int>& speed) {
    vector<pair<int,double>> cars;
    for (int i = 0; i < position.size(); ++i) {
        cars.push_back({position[i], (double)(target - position[i]) / speed[i]});
    }
    sort(cars.begin(), cars.end());
    int fleets = 0;
    double slowestAhead = 0.0;
    for (int i = cars.size() - 1; i >= 0; --i) {
        double t = cars[i].second;
        if (t > slowestAhead) {
            fleets++;
            slowestAhead = t;
        }
    }
    return fleets;
}`,followups:["Can this be written with an explicit stack?","What if two cars arrive at same time?","Why can a faster car not pass?"],review:"Car Fleet compresses cars into nondecreasing arrival-time groups from the target backward."},
{id:"LC 435",title:"Non-overlapping Intervals",difficulty:"Medium",pattern:"Greedy",source:"NeetCode Complement",wave:"Wave 3",prompt:"Given intervals, return the minimum number to remove so the rest are non-overlapping.",signal:"Maximizing kept non-overlapping intervals points to sorting by end time greedily.",hints:["Removing the fewest is equivalent to keeping the most intervals.","Sort by end time.","Keep an interval if its start is at least the last kept end.","Otherwise remove it."],interviewer:["Why sort by end?","What counts as non-overlapping?","Can sorting by start work?","Complexity?"],answer:["Sort intervals by end.","Track lastEnd of the kept interval.","If interval.start >= lastEnd, keep it and update lastEnd.","Otherwise count one removal."],complexity:"O(n log n) time, O(1) extra space after sorting",code:`int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {
        return a[1] < b[1];
    });
    int removed = 0;
    int lastEnd = intervals[0][1];
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] >= lastEnd) {
            lastEnd = intervals[i][1];
        } else {
            removed++;
        }
    }
    return removed;
}`,followups:["How is this related to activity selection?","What if intervals touching are considered overlapping?","Can you return the removed intervals?"],review:"Non-overlapping Intervals keeps the interval that leaves the most room: the earliest ending one."},
{id:"LC 746",title:"Min Cost Climbing Stairs",difficulty:"Easy",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 3",prompt:"Given costs for stairs, return the minimum cost to reach the top when you may climb one or two steps.",signal:"Minimum cost with one-step or two-step transitions points to simple DP.",hints:["You can start from step 0 or step 1.","dp[i] can mean minimum cost to stand on step i.","Transition from i-1 or i-2.","The top is after the last stair, so answer is min of last two positions."],interviewer:["What does dp[i] mean?","Why can you start at index 0 or 1?","Can space be O(1)?","What is the top index?"],answer:["Track two previous minimum costs.","For each stair, cost to stand there is cost[i] plus min(previous two).","Roll the two states forward.","Return min of the final two states."],complexity:"O(n) time, O(1) space",code:`int minCostClimbingStairs(vector<int>& cost) {
    int prev2 = 0, prev1 = 0;
    for (int c : cost) {
        int cur = c + min(prev1, prev2);
        prev2 = prev1;
        prev1 = cur;
    }
    return min(prev1, prev2);
}`,followups:["Can you write dp array first?","How is this different from House Robber?","What if jumps can be up to k steps?"],review:"Min Cost Climbing Stairs is a one-dimensional DP with two previous states."}
];
add.forEach(p=>{p.source="NeetCode Complement";p.wave="Wave 3";});
problems.push(...add.filter(p=>!existing.has(p.id)));
Object.assign(studyMeta,{
"LC 1046":{sourceUrl:"https://leetcode.com/problems/last-stone-weight/",examples:[{input:"stones = [2,7,4,1,8,1]",output:"1"},{input:"stones = [1]",output:"1"}],constraints:["1 <= stones.length <= 30","1 <= stones[i] <= 1000"]},
"LC 621":{sourceUrl:"https://leetcode.com/problems/task-scheduler/",examples:[{input:'tasks = ["A","A","A","B","B","B"], n = 2',output:"8"},{input:'tasks = ["A","C","A","B","D","B"], n = 1',output:"6"}],constraints:["1 <= tasks.length <= 10^4","tasks[i] is an uppercase English letter","0 <= n <= 100"]},
"LC 973":{sourceUrl:"https://leetcode.com/problems/k-closest-points-to-origin/",examples:[{input:"points = [[1,3],[-2,2]], k = 1",output:"[[-2,2]]"},{input:"points = [[3,3],[5,-1],[-2,4]], k = 2",output:"[[3,3],[-2,4]]"}],constraints:["1 <= k <= points.length <= 10^4","-10^4 <= xi, yi <= 10^4"]},
"LC 981":{sourceUrl:"https://leetcode.com/problems/time-based-key-value-store/",examples:[{input:'["TimeMap","set","get","get","set","get","get"] [[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]',output:'[null,null,"bar","bar",null,"bar2","bar2"]'}],constraints:["1 <= key.length, value.length <= 100","1 <= timestamp <= 10^7","set calls for one key use strictly increasing timestamps"]},
"LC 703":{sourceUrl:"https://leetcode.com/problems/kth-largest-element-in-a-stream/",examples:[{input:'["KthLargest","add","add","add","add","add"] [[3,[4,5,8,2]],[3],[5],[10],[9],[4]]',output:"[null,4,5,5,8,8]"}],constraints:["1 <= k <= 10^4","0 <= nums.length <= 10^4","-10^4 <= nums[i], val <= 10^4"]},
"LC 287":{sourceUrl:"https://leetcode.com/problems/find-the-duplicate-number/",examples:[{input:"nums = [1,3,4,2,2]",output:"2"},{input:"nums = [3,1,3,4,2]",output:"3"}],constraints:["1 <= n <= 10^5","nums.length == n + 1","1 <= nums[i] <= n","Only one repeated number exists, but it could repeat more than once."]},
"LC 846":{sourceUrl:"https://leetcode.com/problems/hand-of-straights/",examples:[{input:"hand = [1,2,3,6,2,3,4,7,8], groupSize = 3",output:"true"},{input:"hand = [1,2,3,4,5], groupSize = 4",output:"false"}],constraints:["1 <= hand.length <= 10^4","0 <= hand[i] <= 10^9","1 <= groupSize <= hand.length"]},
"LC 853":{sourceUrl:"https://leetcode.com/problems/car-fleet/",examples:[{input:"target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]",output:"3"},{input:"target = 10, position = [3], speed = [3]",output:"1"}],constraints:["1 <= n <= 10^5","0 < target <= 10^6","0 <= position[i] < target","All positions are unique."]},
"LC 435":{sourceUrl:"https://leetcode.com/problems/non-overlapping-intervals/",examples:[{input:"intervals = [[1,2],[2,3],[3,4],[1,3]]",output:"1"},{input:"intervals = [[1,2],[1,2],[1,2]]",output:"2"}],constraints:["1 <= intervals.length <= 10^5","intervals[i].length == 2","-5 * 10^4 <= starti < endi <= 5 * 10^4"]},
"LC 746":{sourceUrl:"https://leetcode.com/problems/min-cost-climbing-stairs/",examples:[{input:"cost = [10,15,20]",output:"15"},{input:"cost = [1,100,1,1,1,100,1,1,100,1]",output:"6"}],constraints:["2 <= cost.length <= 1000","0 <= cost[i] <= 999"]}
});
Object.assign(alternativeSolutions,{
"LC 1046":{title:"Alternative: Re-sort Each Round",note:"Simpler simulation, slower than heap.",code:`int lastStoneWeight(vector<int>& stones) {
    while (stones.size() > 1) {
        sort(stones.begin(), stones.end());
        int y = stones.back(); stones.pop_back();
        int x = stones.back(); stones.pop_back();
        if (y != x) stones.push_back(y - x);
    }
    return stones.empty() ? 0 : stones[0];
}`},
"LC 621":{title:"Alternative: Heap Simulation",note:"Useful when you need to construct or reason about the schedule step by step.",code:`int leastInterval(vector<char>& tasks, int n) {
    vector<int> cnt(26);
    for (char c : tasks) cnt[c - 'A']++;
    priority_queue<int> pq;
    for (int c : cnt) if (c) pq.push(c);
    int time = 0;
    while (!pq.empty()) {
        vector<int> used;
        for (int i = 0; i <= n; ++i) {
            if (!pq.empty()) {
                int c = pq.top(); pq.pop();
                if (--c) used.push_back(c);
            }
            time++;
            if (pq.empty() && used.empty()) break;
        }
        for (int c : used) pq.push(c);
    }
    return time;
}`},
"LC 973":{title:"Alternative: Quickselect",note:"Average O(n) time, O(1) extra space; mutates point order.",code:`vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto dist = [](const vector<int>& p){ return p[0]*p[0] + p[1]*p[1]; };
    nth_element(points.begin(), points.begin() + k, points.end(),
        [&](const auto& a, const auto& b){ return dist(a) < dist(b); });
    return vector<vector<int>>(points.begin(), points.begin() + k);
}`},
"LC 981":{title:"Alternative: upper_bound",note:"Shorter binary search when pair ordering is comfortable.",code:`class TimeMap {
    unordered_map<string, vector<pair<int,string>>> mp;
public:
    TimeMap() {}
    void set(string key, string value, int timestamp) {
        mp[key].push_back({timestamp, value});
    }
    string get(string key, int timestamp) {
        auto& v = mp[key];
        auto it = upper_bound(v.begin(), v.end(), pair<int,string>{timestamp, string(101, '~')});
        if (it == v.begin()) return "";
        return prev(it)->second;
    }
};`},
"LC 703":{title:"Alternative: Sorted Multiset",note:"O(log n) add with more memory; easier if you also need order queries.",code:`class KthLargest {
    int k;
    multiset<int> values;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int x : nums) values.insert(x);
    }
    int add(int val) {
        values.insert(val);
        auto it = values.end();
        for (int i = 0; i < k; ++i) --it;
        return *it;
    }
};`},
"LC 287":{title:"Alternative: Binary Search On Value",note:"O(n log n) time, O(1) space; uses pigeonhole count.",code:`int findDuplicate(vector<int>& nums) {
    int l = 1, r = nums.size() - 1;
    while (l < r) {
        int mid = l + (r - l) / 2;
        int cnt = 0;
        for (int x : nums) if (x <= mid) cnt++;
        if (cnt > mid) r = mid;
        else l = mid + 1;
    }
    return l;
}`},
"LC 846":{title:"Alternative: Sort And Count",note:"Same greedy idea; sorting gives the smallest-card order.",code:`bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize) return false;
    sort(hand.begin(), hand.end());
    unordered_map<int,int> cnt;
    for (int x : hand) cnt[x]++;
    for (int x : hand) {
        if (!cnt[x]) continue;
        for (int v = x; v < x + groupSize; ++v) {
            if (--cnt[v] < 0) return false;
        }
    }
    return true;
}`},
"LC 853":{title:"Alternative: Explicit Stack",note:"Same logic as reverse scan, but shows fleet merging visually.",code:`int carFleet(int target, vector<int>& position, vector<int>& speed) {
    vector<pair<int,double>> cars;
    for (int i = 0; i < position.size(); ++i)
        cars.push_back({position[i], (double)(target - position[i]) / speed[i]});
    sort(cars.begin(), cars.end());
    vector<double> st;
    for (auto [pos, time] : cars) {
        st.push_back(time);
        while (st.size() >= 2 && st.back() <= st[st.size() - 2]) st.pop_back();
    }
    return st.size();
}`},
"LC 435":{title:"Alternative: Sort By Start And Keep Smaller End",note:"Also O(n log n); when overlap occurs, keep the interval that ends earlier.",code:`int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    int removed = 0, end = intervals[0][1];
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] < end) {
            removed++;
            end = min(end, intervals[i][1]);
        } else {
            end = intervals[i][1];
        }
    }
    return removed;
}`},
"LC 746":{title:"Alternative: DP Array",note:"Clearer state definition before rolling to O(1) space.",code:`int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    vector<int> dp(n + 1, 0);
    for (int i = 2; i <= n; ++i) {
        dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}`}
});
})();
