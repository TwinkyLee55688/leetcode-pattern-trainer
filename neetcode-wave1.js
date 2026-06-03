(() => {
globalThis.neetcode150Ids=["LC 1","LC 2","LC 3","LC 4","LC 5","LC 518","LC 7","LC 1448","LC 10","LC 11","LC 994","LC 15","LC 17","LC 19","LC 20","LC 21","LC 22","LC 23","LC 25","LC 543","LC 33","LC 36","LC 39","LC 40","LC 42","LC 43","LC 45","LC 46","LC 48","LC 49","LC 50","LC 51","LC 53","LC 54","LC 55","LC 56","LC 57","LC 567","LC 572","LC 62","LC 66","LC 70","LC 72","LC 73","LC 74","LC 76","LC 78","LC 79","LC 84","LC 90","LC 91","LC 2013","LC 97","LC 98","LC 100","LC 102","LC 1046","LC 104","LC 105","LC 621","LC 110","LC 115","LC 121","LC 124","LC 125","LC 127","LC 128","LC 130","LC 131","LC 133","LC 134","LC 647","LC 136","LC 138","LC 139","LC 141","LC 143","LC 146","LC 150","LC 152","LC 153","LC 155","LC 678","LC 167","LC 1584","LC 684","LC 695","LC 190","LC 191","LC 198","LC 199","LC 200","LC 202","LC 206","LC 207","LC 208","LC 210","LC 211","LC 212","LC 213","LC 215","LC 217","LC 226","LC 739","LC 1143","LC 230","LC 743","LC 235","LC 746","LC 238","LC 239","LC 242","LC 252","LC 253","LC 763","LC 261","LC 268","LC 269","LC 271","LC 703","LC 704","LC 778","LC 286","LC 287","LC 787","LC 295","LC 297","LC 300","LC 309","LC 312","LC 322","LC 323","LC 329","LC 332","LC 338","LC 347","LC 355","LC 846","LC 371","LC 853","LC 875","LC 416","LC 417","LC 424","LC 435","LC 1851","LC 1899","LC 494","LC 973","LC 981"];
const neetcodeWave1Ids=["LC 206","LC 143","LC 739","LC 84","LC 239","LC 704","LC 875","LC 424","LC 567","LC 647","LC 91","LC 62","LC 78","LC 90","LC 994","LC 695","LC 743","LC 684"];
const existing=new Set(problems.map(p=>p.id));
const add=[
{id:"LC 206",title:"Reverse Linked List",difficulty:"Easy",pattern:"Linked List",secondaryPatterns:["Two Pointers"],source:"NeetCode Complement",prompt:"Given the head of a singly linked list, reverse the list and return the new head.",signal:"Linked list reversal means rewiring next pointers while preserving the next node before changing links.",hints:["Keep prev, cur, and next pointers.","Save cur->next before rewiring cur->next.","Move prev and cur forward one node at a time.","Return prev after cur becomes null."],interviewer:["What pointer is lost if you rewire too early?","Can you solve it iteratively and recursively?","What is the new head?","What are the empty and one-node cases?"],answer:["Initialize prev = nullptr and cur = head.","Save nxt = cur->next.","Set cur->next = prev.","Advance prev = cur and cur = nxt.","Return prev."],complexity:"O(n) time, O(1) space",code:`ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}`,followups:["Can you write the recursive version?","How would you reverse only a sublist?","What if the list is doubly linked?"],review:"Reverse Linked List is the basic next-pointer rewiring invariant."},
{id:"LC 143",title:"Reorder List",difficulty:"Medium",pattern:"Linked List",secondaryPatterns:["Two Pointers","Stack"],source:"NeetCode Complement",prompt:"Given head, reorder the list from L0 -> L1 -> ... -> Ln into L0 -> Ln -> L1 -> Ln-1 -> ... in-place.",signal:"Reordering from both ends of a singly linked list points to split middle, reverse second half, then merge alternately.",hints:["Use slow/fast pointers to find the middle.","Reverse the second half.","Merge first half and reversed second half alternately.","Save next pointers before every rewire."],interviewer:["Why split at the middle first?","Why reverse the second half?","How do you avoid losing the next node?","What happens for odd length?"],answer:["Find the middle with slow/fast pointers.","Detach and reverse the second half.","Merge first and second halves by alternating nodes.","Stop when the second half is exhausted."],complexity:"O(n) time, O(1) space",code:`void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    ListNode* second = slow->next;
    slow->next = nullptr;
    ListNode* prev = nullptr;
    while (second) {
        ListNode* nxt = second->next;
        second->next = prev;
        prev = second;
        second = nxt;
    }

    ListNode* first = head;
    second = prev;
    while (second) {
        ListNode* n1 = first->next;
        ListNode* n2 = second->next;
        first->next = second;
        second->next = n1;
        first = n1;
        second = n2;
    }
}`,followups:["Can a stack solve it?","Why not copy values into an array?","How do odd and even lengths differ?"],review:"Reorder List is split, reverse second half, then merge."},
{id:"LC 739",title:"Daily Temperatures",difficulty:"Medium",pattern:"Stack",source:"NeetCode Complement",prompt:"Given daily temperatures, return how many days each day must wait until a warmer temperature. If none, return 0.",signal:"Next warmer day is a next-greater-element problem, so use a monotonic decreasing stack of indices.",hints:["Store indices, not temperatures only.","The stack waits for a warmer future day.","When current temperature is warmer than stack top, resolve that previous day.","The difference of indices is the waiting time."],interviewer:["What does the stack contain?","Why is it decreasing?","Why is each index pushed and popped once?","What if no warmer day exists?"],answer:["Create ans initialized with zeros.","Scan temperatures left to right.","While current temperature is warmer than stack top, pop and fill the distance.","Push the current index."],complexity:"O(n) time, O(n) space",code:`vector<int> dailyTemperatures(vector<int>& temperatures) {
    vector<int> ans(temperatures.size(), 0);
    stack<int> st;
    for (int i = 0; i < temperatures.size(); ++i) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int j = st.top();
            st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,followups:["Can you scan from right to left?","How does this relate to next greater element?","Why not nested loops?"],review:"Daily Temperatures is monotonic stack for next greater temperature."},
{id:"LC 84",title:"Largest Rectangle in Histogram",difficulty:"Hard",pattern:"Stack",source:"NeetCode Complement",prompt:"Given bar heights in a histogram, return the area of the largest rectangle.",signal:"Largest rectangle needs each bar's first smaller boundary on both sides, which a monotonic increasing stack exposes.",hints:["A bar can extend until a smaller bar appears.","Use an increasing stack of indices.","When current height is smaller, pop bars and compute their maximal width.","Append a sentinel zero height to flush the stack."],interviewer:["What boundary does popping reveal?","Why use a sentinel?","How is width computed after pop?","Why is it O(n)?"],answer:["Scan all bars plus a final zero sentinel.","Keep indices of increasing heights.","When height drops, pop the previous bar as the limiting height.","Width is current index minus the new stack top minus one.","Update max area."],complexity:"O(n) time, O(n) space",code:`int largestRectangleArea(vector<int>& heights) {
    vector<int> h = heights;
    h.push_back(0);
    stack<int> st;
    int best = 0;
    for (int i = 0; i < h.size(); ++i) {
        while (!st.empty() && h[i] < h[st.top()]) {
            int height = h[st.top()];
            st.pop();
            int left = st.empty() ? -1 : st.top();
            best = max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    return best;
}`,followups:["Can you precompute left/right smaller arrays?","Why does equal height handling still work?","How does this differ from trapping rain water?"],review:"Histogram area is monotonic stack plus smaller-boundary width."},
{id:"LC 239",title:"Sliding Window Maximum",difficulty:"Hard",pattern:"Sliding Window",secondaryPatterns:["Stack","Heap"],source:"NeetCode Complement",prompt:"Given nums and window size k, return the maximum value in each sliding window.",signal:"Window maximum with moving boundaries points to a monotonic deque of useful candidate indices.",hints:["Remove indices that leave the window.","Maintain decreasing values in the deque.","Before pushing current index, remove weaker smaller values from the back.","The front is the maximum for the current window."],interviewer:["Why store indices instead of values?","Why remove smaller values from the back?","How do you detect expired indices?","Can a heap solve it too?"],answer:["Use a deque of indices with decreasing nums values.","Pop front if it is outside the window.","Pop back while nums[back] <= nums[i].","Push i, and after i >= k-1 record nums[front]."],complexity:"O(n) time, O(k) space",code:`vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> ans;
    for (int i = 0; i < nums.size(); ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) ans.push_back(nums[dq.front()]);
    }
    return ans;
}`,followups:["Can you solve with a max-heap?","What if k equals 1?","Why is deque O(n)?"],review:"Sliding Window Maximum keeps only non-expired, decreasing candidates."},
{id:"LC 704",title:"Binary Search",difficulty:"Easy",pattern:"Binary Search",source:"NeetCode Complement",prompt:"Given a sorted array nums and target, return target's index or -1.",signal:"Sorted array plus O(log n) requirement is direct binary search.",hints:["Use l <= r for inclusive boundaries.","Compute mid without overflow.","If nums[mid] is too small, search right.","If too large, search left."],interviewer:["What are your boundaries?","How do you avoid overflow?","What if target is missing?","How do duplicates affect this version?"],answer:["Set l = 0, r = n - 1.","While l <= r, compare nums[mid] to target.","Move the boundary that cannot contain target.","Return -1 if the loop ends."],complexity:"O(log n) time, O(1) space",code:`int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,followups:["Can you write lower_bound?","What if you need first occurrence?","How would recursion look?"],review:"Binary Search is the clean boundary-control baseline."},
{id:"LC 875",title:"Koko Eating Bananas",difficulty:"Medium",pattern:"Binary Search",source:"NeetCode Complement",prompt:"Given banana piles and h hours, find the minimum integer eating speed that lets Koko finish in time.",signal:"Minimum feasible speed is binary search on answer space with monotonic hours-needed predicate.",hints:["If speed is faster, required hours never increases.","Search speed from 1 to max pile.","For speed k, hours for a pile is ceil(pile / k).","Keep the smallest feasible speed."],interviewer:["What is the monotonic predicate?","How do you compute ceil division?","Why search speed instead of piles?","What are the bounds?"],answer:["Binary search k between 1 and max(piles).","Compute total hours using (pile + k - 1) / k.","If hours <= h, k is feasible, try smaller.","Otherwise try larger."],complexity:"O(n log M) time, O(1) space",code:`int minEatingSpeed(vector<int>& piles, int h) {
    int l = 1, r = *max_element(piles.begin(), piles.end());
    while (l < r) {
        int m = l + (r - l) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + m - 1) / m;
        if (hours <= h) r = m;
        else l = m + 1;
    }
    return l;
}`,followups:["Why is the predicate monotonic?","What if h is very large?","Can linear search pass?"],review:"Koko is binary search for the minimum feasible speed."},
{id:"LC 424",title:"Longest Repeating Character Replacement",difficulty:"Medium",pattern:"Sliding Window",source:"NeetCode Complement",prompt:"Given uppercase string s and k replacements, return the longest substring that can become all one repeated character.",signal:"Longest substring with at most k fixes uses sliding window where windowLen - maxFreq <= k.",hints:["Inside a window, keep the most frequent character count.","Other characters need replacement.","Window is valid if length - maxFreq <= k.","Shrink only when replacements needed exceed k."],interviewer:["Why does max frequency matter?","Why can maxFreq be stale?","What is the window invariant?","What if k is zero?"],answer:["Track counts for 26 letters and maxFreq in the current scan.","Expand right one char at a time.","If window size minus maxFreq exceeds k, shrink left.","Track the largest valid window length."],complexity:"O(n) time, O(1) space",code:`int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int left = 0, maxFreq = 0, best = 0;
    for (int right = 0; right < s.size(); ++right) {
        maxFreq = max(maxFreq, ++count[s[right] - 'A']);
        while (right - left + 1 - maxFreq > k) {
            count[s[left] - 'A']--;
            left++;
        }
        best = max(best, right - left + 1);
    }
    return best;
}`,followups:["Why is stale maxFreq acceptable?","What if alphabet is Unicode?","Can this be solved by binary search on length?"],review:"Replacement window validity is window length minus dominant char count."},
{id:"LC 567",title:"Permutation in String",difficulty:"Medium",pattern:"Sliding Window",secondaryPatterns:["Array / HashMap"],source:"NeetCode Complement",prompt:"Given s1 and s2, return whether s2 contains a permutation of s1.",signal:"Permutation substring means fixed-size sliding window with character counts matching s1.",hints:["The window length must be s1.length().","Count characters required by s1.","Slide a same-length window over s2.","A matching count vector means a permutation exists."],interviewer:["Why fixed-size window?","How do duplicates in s1 matter?","Can you avoid comparing 26 counts each time?","What if s1 is longer than s2?"],answer:["Return false if s1 is longer than s2.","Build count arrays for s1 and the first window of s2.","Compare counts, then slide one char out and one char in.","Return true on any matching window."],complexity:"O(n * 26) time, O(1) space",code:`bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    vector<int> need(26, 0), window(26, 0);
    for (char c : s1) need[c - 'a']++;
    for (int i = 0; i < s2.size(); ++i) {
        window[s2[i] - 'a']++;
        if (i >= s1.size()) window[s2[i - s1.size()] - 'a']--;
        if (window == need) return true;
    }
    return false;
}`,followups:["Can you maintain match count instead of comparing arrays?","What if characters are not lowercase English?","How does this differ from anagram grouping?"],review:"Permutation in String is fixed-window anagram detection."},
{id:"LC 647",title:"Palindromic Substrings",difficulty:"Medium",pattern:"Two Pointers",secondaryPatterns:["Dynamic Programming"],source:"NeetCode Complement",prompt:"Given a string s, return how many substrings are palindromes.",signal:"Counting palindromic substrings is expand-around-center over every odd and even center.",hints:["Every palindrome has a center.","Centers can be one character or the gap between two characters.","Expand while left/right characters match.","Count every successful expansion."],interviewer:["Why two centers per index?","What is the complexity?","Can DP solve it?","How is this different from longest palindrome?"],answer:["For each index, expand odd center (i,i).","Also expand even center (i,i+1).","Each matching expansion forms one palindromic substring.","Sum all expansions."],complexity:"O(n^2) time, O(1) space",code:`int countSubstrings(string s) {
    auto expand = [&](int l, int r) {
        int count = 0;
        while (l >= 0 && r < s.size() && s[l] == s[r]) {
            count++;
            l--;
            r++;
        }
        return count;
    };
    int ans = 0;
    for (int i = 0; i < s.size(); ++i) {
        ans += expand(i, i);
        ans += expand(i, i + 1);
    }
    return ans;
}`,followups:["Can DP count palindromes?","Can Manacher optimize related problems?","How do you return the substrings?"],review:"Palindromic Substrings counts every expansion around every center."},
{id:"LC 91",title:"Decode Ways",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",prompt:"Given a digit string, return how many ways it can be decoded using 1 -> A through 26 -> Z.",signal:"Decode Ways is 1D DP where each position can use one digit or a valid two-digit code.",hints:["A leading zero cannot decode alone.","dp[i] means ways to decode the first i characters.","One digit contributes if s[i-1] is not zero.","Two digits contribute if the number from 10 to 26."],interviewer:["How do zeros behave?","What does dp[i] mean?","Why check one and two digits?","Can you compress space?"],answer:["Let prev2 = ways before two positions and prev1 = ways before one position.","For each position, add prev1 if current digit is valid alone.","Add prev2 if the previous two digits form 10..26.","Shift states forward."],complexity:"O(n) time, O(1) space",code:`int numDecodings(string s) {
    if (s.empty() || s[0] == '0') return 0;
    int prev2 = 1, prev1 = 1;
    for (int i = 1; i < s.size(); ++i) {
        int cur = 0;
        if (s[i] != '0') cur += prev1;
        int two = (s[i - 1] - '0') * 10 + (s[i] - '0');
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,followups:["Why is 06 invalid?","Can recursion with memo solve it?","How do you handle long strings?"],review:"Decode Ways is one/two-character DP with zero handling."},
{id:"LC 62",title:"Unique Paths",difficulty:"Medium",pattern:"Dynamic Programming",secondaryPatterns:["Math"],source:"NeetCode Complement",prompt:"Given an m by n grid where you can only move right or down, return the number of paths from top-left to bottom-right.",signal:"Grid path count with only right/down moves is DP from top and left.",hints:["Each cell can only be reached from top or left.","First row and first column have one path each.","dp[j] can represent current row path counts.","Update dp[j] += dp[j-1]."],interviewer:["What is the DP state?","Why can space be O(n)?","What is the combinatorics formula?","What are the edges?"],answer:["Use a 1D dp array initialized with ones.","For each later row, update each column from left to right.","dp[j] becomes paths from top plus paths from left.","Return dp[n-1]."],complexity:"O(mn) time, O(n) space",code:`int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int r = 1; r < m; ++r) {
        for (int c = 1; c < n; ++c) {
            dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`,followups:["Can you solve with combinations?","How do obstacles change the DP?","Can you use O(1) extra space?"],review:"Unique Paths is path-count DP: top plus left."},
{id:"LC 78",title:"Subsets",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Bit Manipulation"],source:"NeetCode Complement",prompt:"Given unique nums, return all possible subsets.",signal:"Generate all include/exclude choices with backtracking or bit masks.",hints:["Every number has two choices: include or skip.","Record the current subset at every recursion node.","Backtrack by undoing the push.","There are 2^n subsets."],interviewer:["Why record before reaching the end?","What is the output size?","Can bit masks solve it?","How do duplicates change the problem?"],answer:["DFS over index and current subset.","At each index, first skip or include the value.","Push before include recursion, pop after.","Return all recorded subsets."],complexity:"O(n * 2^n) time, O(n) recursion space excluding output",code:`vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int)> dfs = [&](int i) {
        if (i == nums.size()) {
            ans.push_back(path);
            return;
        }
        dfs(i + 1);
        path.push_back(nums[i]);
        dfs(i + 1);
        path.pop_back();
    };
    dfs(0);
    return ans;
}`,followups:["Can bit masks generate subsets?","What if nums has duplicates?","What is memory complexity including output?"],review:"Subsets is pure include/skip backtracking."},
{id:"LC 90",title:"Subsets II",difficulty:"Medium",pattern:"Backtracking",source:"NeetCode Complement",prompt:"Given nums that may contain duplicates, return all unique subsets.",signal:"Duplicate subsets require sorting and skipping equal choices at the same recursion depth.",hints:["Sort nums first.","Record the current path at each recursion node.","At a depth, skip repeated values after the first choice.","Backtracking path still uses push and pop."],interviewer:["Why sort first?","What duplicate are you skipping?","How is this different from Subsets?","Can bit masks work?"],answer:["Sort nums.","DFS from a start index and record current path.","For each candidate, skip nums[i] if it equals nums[i-1] at the same depth.","Choose, recurse, then undo."],complexity:"O(n * 2^n) time, O(n) recursion space excluding output",code:`vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int)> dfs = [&](int start) {
        ans.push_back(path);
        for (int i = start; i < nums.size(); ++i) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.push_back(nums[i]);
            dfs(i + 1);
            path.pop_back();
        }
    };
    dfs(0);
    return ans;
}`,followups:["Why not use a set of vectors?","Can you count unique subsets?","How do duplicates affect permutations?"],review:"Subsets II is sorted backtracking with same-depth duplicate skipping."},
{id:"LC 994",title:"Rotting Oranges",difficulty:"Medium",pattern:"Graph",secondaryPatterns:["Matrix"],source:"NeetCode Complement",prompt:"Given a grid of fresh and rotten oranges, return the minutes until all fresh oranges rot, or -1 if impossible.",signal:"Simultaneous spread by minutes is multi-source BFS from all initially rotten oranges.",hints:["Push every rotten orange into the queue first.","Count fresh oranges.","Each BFS layer is one minute.","When a fresh neighbor rots, decrement fresh count."],interviewer:["Why multi-source BFS?","When do minutes increase?","How do you detect impossible?","What if there are no fresh oranges?"],answer:["Initialize queue with all rotten cells and count fresh cells.","Process BFS level by level.","For each rotten cell, rot adjacent fresh cells and enqueue them.","Return minutes if fresh becomes zero, otherwise -1."],complexity:"O(mn) time, O(mn) space",code:`int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), fresh = 0, minutes = 0;
    queue<pair<int,int>> q;
    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {
        if (grid[r][c] == 2) q.push({r, c});
        if (grid[r][c] == 1) fresh++;
    }
    vector<int> dirs = {1, 0, -1, 0, 1};
    while (!q.empty() && fresh) {
        int sz = q.size();
        minutes++;
        while (sz--) {
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; ++d) {
                int nr = r + dirs[d], nc = c + dirs[d + 1];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != 1) continue;
                grid[nr][nc] = 2;
                fresh--;
                q.push({nr, nc});
            }
        }
    }
    return fresh ? -1 : minutes;
}`,followups:["Can DFS model simultaneous minutes?","What if diagonals count?","How do obstacles change it?"],review:"Rotting Oranges is multi-source BFS by minute layers."},
{id:"LC 695",title:"Max Area of Island",difficulty:"Medium",pattern:"Graph",secondaryPatterns:["Matrix"],source:"NeetCode Complement",prompt:"Given a grid of 0 water and 1 land, return the area of the largest island.",signal:"Largest connected component in a grid is DFS/BFS over land cells with visited marking.",hints:["An island is a connected component of 1s.","Mark visited cells immediately.","DFS returns the area contributed by a cell plus neighbors.","Track the maximum area."],interviewer:["What are nodes and edges?","Can you mutate grid?","Why mark before recursing?","What if grid is all water?"],answer:["Scan every cell.","When a land cell is found, DFS/BFS to count its component area.","Mark cells visited by changing 1 to 0 or using visited.","Update best area."],complexity:"O(mn) time, O(mn) recursion/queue worst-case space",code:`int maxAreaOfIsland(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    function<int(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] == 0) return 0;
        grid[r][c] = 0;
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    };
    int best = 0;
    for (int r = 0; r < m; ++r)
        for (int c = 0; c < n; ++c)
            if (grid[r][c] == 1) best = max(best, dfs(r, c));
    return best;
}`,followups:["Can BFS avoid recursion depth?","Can you preserve the grid?","How would diagonals change it?"],review:"Max Area of Island is connected-component area in an implicit grid graph."},
{id:"LC 743",title:"Network Delay Time",difficulty:"Medium",pattern:"Graph",secondaryPatterns:["Heap"],source:"NeetCode Complement",prompt:"Given directed weighted edges, return how long it takes for a signal from k to reach all nodes, or -1.",signal:"Shortest paths with positive weights points to Dijkstra using a min-heap.",hints:["Build an adjacency list of directed weighted edges.","Use min-heap by current distance.","Skip stale heap entries after a node has its shortest distance.","Answer is the maximum shortest distance."],interviewer:["Why not plain BFS?","Why does Dijkstra apply?","How do you handle unreachable nodes?","What is heap complexity?"],answer:["Build graph u -> (v,w).","Run Dijkstra from k.","When a node is finalized, record its distance.","If not all nodes are reached return -1; otherwise return the largest distance."],complexity:"O(E log V) time, O(V + E) space",code:`int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> graph(n + 1);
    for (auto& e : times) graph[e[0]].push_back({e[1], e[2]});
    vector<int> dist(n + 1, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    dist[k] = 0;
    pq.push({0, k});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : graph[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    int ans = 0;
    for (int i = 1; i <= n; ++i) {
        if (dist[i] == INT_MAX) return -1;
        ans = max(ans, dist[i]);
    }
    return ans;
}`,followups:["What if edges had negative weights?","Can Bellman-Ford solve it?","Why take max distance at the end?"],review:"Network Delay Time is Dijkstra plus max shortest-path distance."},
{id:"LC 684",title:"Redundant Connection",difficulty:"Medium",pattern:"Graph",source:"NeetCode Complement",prompt:"Given edges of an undirected graph formed from a tree plus one extra edge, return the edge that creates a cycle.",signal:"Adding edges until a cycle appears points to Union-Find connectivity checks.",hints:["A tree with one extra edge has exactly one cycle.","Union-Find tracks connected components.","If an edge connects nodes already in the same component, it is redundant.","Return that edge."],interviewer:["Why Union-Find?","What does find return?","When is an edge redundant?","Can DFS solve it too?"],answer:["Initialize each node as its own parent.","For each edge, find roots of both endpoints.","If roots match, return the edge.","Otherwise union the components."],complexity:"O(n alpha(n)) time, O(n) space",code:`vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    vector<int> parent(edges.size() + 1), rank(edges.size() + 1, 0);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    };
    for (auto& e : edges) {
        int a = find(e[0]), b = find(e[1]);
        if (a == b) return e;
        if (rank[a] < rank[b]) swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
    }
    return {};
}`,followups:["Can DFS detect the cycle?","How does path compression help?","What changes for directed graph version?"],review:"Redundant Connection is cycle detection by Union-Find."}
];
add.forEach(p=>p.wave="Wave 1");
problems.push(...add.filter(p=>!existing.has(p.id)));
Object.assign(studyMeta,{
"LC 206":{sourceUrl:"https://leetcode.com/problems/reverse-linked-list/",examples:[{input:"head = [1,2,3,4,5]",output:"[5,4,3,2,1]"},{input:"head = []",output:"[]"}],constraints:["0 <= number of nodes <= 5000","-5000 <= Node.val <= 5000"]},
"LC 143":{sourceUrl:"https://leetcode.com/problems/reorder-list/",examples:[{input:"head = [1,2,3,4]",output:"[1,4,2,3]"},{input:"head = [1,2,3,4,5]",output:"[1,5,2,4,3]"}],constraints:["The number of nodes is in the range [1, 5 * 10^4].","1 <= Node.val <= 1000"]},
"LC 739":{sourceUrl:"https://leetcode.com/problems/daily-temperatures/",examples:[{input:"temperatures = [73,74,75,71,69,72,76,73]",output:"[1,1,4,2,1,1,0,0]"},{input:"temperatures = [30,40,50,60]",output:"[1,1,1,0]"}],constraints:["1 <= temperatures.length <= 10^5","30 <= temperatures[i] <= 100"]},
"LC 84":{sourceUrl:"https://leetcode.com/problems/largest-rectangle-in-histogram/",examples:[{input:"heights = [2,1,5,6,2,3]",output:"10"},{input:"heights = [2,4]",output:"4"}],constraints:["1 <= heights.length <= 10^5","0 <= heights[i] <= 10^4"]},
"LC 239":{sourceUrl:"https://leetcode.com/problems/sliding-window-maximum/",examples:[{input:"nums = [1,3,-1,-3,5,3,6,7], k = 3",output:"[3,3,5,5,6,7]"},{input:"nums = [1], k = 1",output:"[1]"}],constraints:["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","1 <= k <= nums.length"]},
"LC 704":{sourceUrl:"https://leetcode.com/problems/binary-search/",examples:[{input:"nums = [-1,0,3,5,9,12], target = 9",output:"4"},{input:"nums = [-1,0,3,5,9,12], target = 2",output:"-1"}],constraints:["1 <= nums.length <= 10^4","-10^4 < nums[i], target < 10^4","All integers in nums are unique.","nums is sorted in ascending order."]},
"LC 875":{sourceUrl:"https://leetcode.com/problems/koko-eating-bananas/",examples:[{input:"piles = [3,6,7,11], h = 8",output:"4"},{input:"piles = [30,11,23,4,20], h = 5",output:"30"}],constraints:["1 <= piles.length <= 10^4","1 <= piles[i] <= 10^9","piles.length <= h <= 10^9"]},
"LC 424":{sourceUrl:"https://leetcode.com/problems/longest-repeating-character-replacement/",examples:[{input:'s = "ABAB", k = 2',output:"4"},{input:'s = "AABABBA", k = 1',output:"4"}],constraints:["1 <= s.length <= 10^5","s consists of uppercase English letters.","0 <= k <= s.length"]},
"LC 567":{sourceUrl:"https://leetcode.com/problems/permutation-in-string/",examples:[{input:'s1 = "ab", s2 = "eidbaooo"',output:"true",note:'s2 contains permutation "ba".'},{input:'s1 = "ab", s2 = "eidboaoo"',output:"false"}],constraints:["1 <= s1.length, s2.length <= 10^4","s1 and s2 consist of lowercase English letters."]},
"LC 647":{sourceUrl:"https://leetcode.com/problems/palindromic-substrings/",examples:[{input:'s = "abc"',output:"3",note:'The palindromes are "a", "b", and "c".'},{input:'s = "aaa"',output:"6"}],constraints:["1 <= s.length <= 1000","s consists of lowercase English letters."]},
"LC 91":{sourceUrl:"https://leetcode.com/problems/decode-ways/",examples:[{input:'s = "12"',output:"2",note:'It can decode as "AB" or "L".'},{input:'s = "226"',output:"3"},{input:'s = "06"',output:"0"}],constraints:["1 <= s.length <= 100","s contains only digits and may contain leading zeroes."]},
"LC 62":{sourceUrl:"https://leetcode.com/problems/unique-paths/",examples:[{input:"m = 3, n = 7",output:"28"},{input:"m = 3, n = 2",output:"3"}],constraints:["1 <= m, n <= 100","The answer is <= 2 * 10^9."]},
"LC 78":{sourceUrl:"https://leetcode.com/problems/subsets/",examples:[{input:"nums = [1,2,3]",output:"[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"},{input:"nums = [0]",output:"[[],[0]]"}],constraints:["1 <= nums.length <= 10","All numbers of nums are unique."]},
"LC 90":{sourceUrl:"https://leetcode.com/problems/subsets-ii/",examples:[{input:"nums = [1,2,2]",output:"[[],[1],[1,2],[1,2,2],[2],[2,2]]"},{input:"nums = [0]",output:"[[],[0]]"}],constraints:["1 <= nums.length <= 10","-10 <= nums[i] <= 10"]},
"LC 994":{sourceUrl:"https://leetcode.com/problems/rotting-oranges/",examples:[{input:"grid = [[2,1,1],[1,1,0],[0,1,1]]",output:"4"},{input:"grid = [[2,1,1],[0,1,1],[1,0,1]]",output:"-1"}],constraints:["1 <= m, n <= 10","grid[i][j] is 0, 1, or 2."]},
"LC 695":{sourceUrl:"https://leetcode.com/problems/max-area-of-island/",examples:[{input:"grid = [[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0]]",output:"5"},{input:"grid = [[0,0,0,0]]",output:"0"}],constraints:["1 <= m, n <= 50","grid[i][j] is 0 or 1."]},
"LC 743":{sourceUrl:"https://leetcode.com/problems/network-delay-time/",examples:[{input:"times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",output:"2"},{input:"times = [[1,2,1]], n = 2, k = 1",output:"1"}],constraints:["1 <= n <= 100","1 <= times.length <= 6000","times[i] = [ui, vi, wi]","1 <= wi <= 100"]},
"LC 684":{sourceUrl:"https://leetcode.com/problems/redundant-connection/",examples:[{input:"edges = [[1,2],[1,3],[2,3]]",output:"[2,3]"},{input:"edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]",output:"[1,4]"}],constraints:["3 <= n <= 1000","edges.length == n","edges[i].length == 2"]}
});
Object.assign(alternativeSolutions,{
"LC 206":{title:"Alternative: Recursive Reversal",note:"Same O(n) time, O(n) recursion stack. Good for explaining reverse-rest invariant.",code:`ListNode* reverseList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverseList(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`},
"LC 239":{title:"Alternative: Max-Heap With Lazy Expiry",note:"O(n log n) time, easier to derive but slower than deque.",code:`vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    priority_queue<pair<int,int>> pq;
    vector<int> ans;
    for (int i = 0; i < nums.size(); ++i) {
        pq.push({nums[i], i});
        while (pq.top().second <= i - k) pq.pop();
        if (i >= k - 1) ans.push_back(pq.top().first);
    }
    return ans;
}`},
"LC 647":{title:"Alternative: DP Palindrome Table",note:"O(n^2) time and space; useful when you also need palindrome lookup.",code:`int countSubstrings(string s) {
    int n = s.size(), ans = 0;
    vector<vector<bool>> dp(n, vector<bool>(n, false));
    for (int len = 1; len <= n; ++len) {
        for (int l = 0; l + len <= n; ++l) {
            int r = l + len - 1;
            if (s[l] == s[r] && (len <= 2 || dp[l + 1][r - 1])) {
                dp[l][r] = true;
                ans++;
            }
        }
    }
    return ans;
}`},
"LC 62":{title:"Alternative: Combinatorics",note:"O(min(m,n)) time, O(1) space; choose positions for down or right moves.",code:`int uniquePaths(int m, int n) {
    int moves = m + n - 2;
    int choose = min(m - 1, n - 1);
    long long ans = 1;
    for (int i = 1; i <= choose; ++i) {
        ans = ans * (moves - choose + i) / i;
    }
    return ans;
}`},
"LC 78":{title:"Alternative: Bitmask Generation",note:"O(n * 2^n) time; every mask represents one subset.",code:`vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans;
    int total = 1 << nums.size();
    for (int mask = 0; mask < total; ++mask) {
        vector<int> cur;
        for (int i = 0; i < nums.size(); ++i)
            if (mask & (1 << i)) cur.push_back(nums[i]);
        ans.push_back(cur);
    }
    return ans;
}`},
"LC 143":{title:"Alternative: Stack Merge",note:"O(n) time, O(n) space. Easier to reason about before optimizing to O(1) space.",code:`void reorderList(ListNode* head) {
    vector<ListNode*> nodes;
    for (ListNode* cur = head; cur; cur = cur->next) nodes.push_back(cur);
    int l = 0, r = nodes.size() - 1;
    while (l < r) {
        nodes[l++]->next = nodes[r];
        if (l == r) break;
        nodes[r--]->next = nodes[l];
    }
    nodes[l]->next = nullptr;
}`},
"LC 739":{title:"Alternative: Right-to-Left Jumping",note:"O(n * range) worst case but often intuitive; monotonic stack is the safer interview answer.",code:`vector<int> dailyTemperatures(vector<int>& temperatures) {
    vector<int> ans(temperatures.size(), 0);
    for (int i = temperatures.size() - 2; i >= 0; --i) {
        int j = i + 1;
        while (j < temperatures.size() && temperatures[j] <= temperatures[i] && ans[j] > 0) {
            j += ans[j];
        }
        if (j < temperatures.size() && temperatures[j] > temperatures[i]) ans[i] = j - i;
    }
    return ans;
}`},
"LC 84":{title:"Alternative: Precompute Smaller Boundaries",note:"O(n) time, O(n) space. Same idea as stack, but stores left/right limits explicitly.",code:`int largestRectangleArea(vector<int>& heights) {
    int n = heights.size();
    vector<int> left(n), right(n);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && heights[st.top()] >= heights[i]) st.pop();
        left[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();
    for (int i = n - 1; i >= 0; --i) {
        while (!st.empty() && heights[st.top()] >= heights[i]) st.pop();
        right[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    int best = 0;
    for (int i = 0; i < n; ++i) best = max(best, heights[i] * (right[i] - left[i] - 1));
    return best;
}`},
"LC 704":{title:"Alternative: Half-Open Boundary",note:"O(log n) time. Useful to practice lower_bound style intervals.",code:`int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size();
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] < target) l = m + 1;
        else r = m;
    }
    return l < nums.size() && nums[l] == target ? l : -1;
}`},
"LC 875":{title:"Alternative: Feasibility Helper",note:"Same O(n log M) complexity, cleaner for explaining binary search on answer.",code:`int minEatingSpeed(vector<int>& piles, int h) {
    auto can = [&](int speed) {
        long long hours = 0;
        for (int p : piles) hours += (p + speed - 1) / speed;
        return hours <= h;
    };
    int l = 1, r = *max_element(piles.begin(), piles.end());
    while (l < r) {
        int m = l + (r - l) / 2;
        if (can(m)) r = m;
        else l = m + 1;
    }
    return l;
}`},
"LC 424":{title:"Alternative: Binary Search Window Length",note:"O(26n log n) time. Useful as a follow-up when explaining monotonic feasibility.",code:`int characterReplacement(string s, int k) {
    auto ok = [&](int len) {
        vector<int> cnt(26, 0);
        int best = 0;
        for (int i = 0; i < s.size(); ++i) {
            best = max(best, ++cnt[s[i] - 'A']);
            if (i >= len) cnt[s[i - len] - 'A']--;
            if (i >= len - 1 && len - best <= k) return true;
        }
        return false;
    };
    int l = 1, r = s.size(), ans = 0;
    while (l <= r) {
        int m = (l + r) / 2;
        if (ok(m)) ans = m, l = m + 1;
        else r = m - 1;
    }
    return ans;
}`},
"LC 567":{title:"Alternative: Match Counter",note:"O(n) time with a fixed alphabet; avoids comparing the full count array each step.",code:`bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    vector<int> diff(26, 0);
    for (char c : s1) diff[c - 'a']--;
    int matches = 0;
    auto add = [&](int idx, int delta) {
        if (diff[idx] == 0) matches--;
        diff[idx] += delta;
        if (diff[idx] == 0) matches++;
    };
    for (int i = 0; i < 26; ++i) if (diff[i] == 0) matches++;
    for (int i = 0; i < s2.size(); ++i) {
        add(s2[i] - 'a', 1);
        if (i >= s1.size()) add(s2[i - s1.size()] - 'a', -1);
        if (matches == 26) return true;
    }
    return false;
}`},
"LC 91":{title:"Alternative: DP Array",note:"O(n) time, O(n) space. More explicit state before compressing to O(1).",code:`int numDecodings(string s) {
    int n = s.size();
    vector<int> dp(n + 1, 0);
    dp[0] = 1;
    for (int i = 1; i <= n; ++i) {
        if (s[i - 1] != '0') dp[i] += dp[i - 1];
        if (i >= 2) {
            int two = (s[i - 2] - '0') * 10 + (s[i - 1] - '0');
            if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
        }
    }
    return dp[n];
}`},
"LC 90":{title:"Alternative: Iterative Ranges",note:"O(n * 2^n) time. Track the range created by the previous duplicate value.",code:`vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> ans = {{}};
    int start = 0, prevSize = 0;
    for (int i = 0; i < nums.size(); ++i) {
        start = (i > 0 && nums[i] == nums[i - 1]) ? prevSize : 0;
        prevSize = ans.size();
        int curSize = ans.size();
        for (int j = start; j < curSize; ++j) {
            auto subset = ans[j];
            subset.push_back(nums[i]);
            ans.push_back(subset);
        }
    }
    return ans;
}`},
"LC 994":{title:"Alternative: Timestamp In Grid",note:"Still O(mn); stores the minute directly in the grid instead of explicit level loops.",code:`int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), fresh = 0, ans = 2;
    queue<pair<int,int>> q;
    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {
        if (grid[r][c] == 2) q.push({r, c});
        if (grid[r][c] == 1) fresh++;
    }
    vector<int> d = {1,0,-1,0,1};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        ans = max(ans, grid[r][c]);
        for (int k = 0; k < 4; ++k) {
            int nr = r + d[k], nc = c + d[k+1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != 1) continue;
            grid[nr][nc] = grid[r][c] + 1;
            fresh--;
            q.push({nr,nc});
        }
    }
    return fresh ? -1 : ans - 2;
}`},
"LC 695":{title:"Alternative: BFS Component Count",note:"O(mn) time, O(mn) queue space. Avoids recursion depth.",code:`int maxAreaOfIsland(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), best = 0;
    vector<int> d = {1,0,-1,0,1};
    for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {
        if (!grid[r][c]) continue;
        int area = 0;
        queue<pair<int,int>> q;
        q.push({r,c});
        grid[r][c] = 0;
        while (!q.empty()) {
            auto [x,y] = q.front(); q.pop();
            area++;
            for (int k = 0; k < 4; ++k) {
                int nx = x + d[k], ny = y + d[k+1];
                if (nx < 0 || ny < 0 || nx >= m || ny >= n || !grid[nx][ny]) continue;
                grid[nx][ny] = 0;
                q.push({nx,ny});
            }
        }
        best = max(best, area);
    }
    return best;
}`},
"LC 743":{title:"Alternative: Bellman-Ford",note:"O(VE) time. Works even with negative edges, though this problem has positive weights.",code:`int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    const int INF = 1e9;
    vector<int> dist(n + 1, INF);
    dist[k] = 0;
    for (int i = 1; i < n; ++i) {
        for (auto& e : times) {
            if (dist[e[0]] != INF) dist[e[1]] = min(dist[e[1]], dist[e[0]] + e[2]);
        }
    }
    int ans = 0;
    for (int i = 1; i <= n; ++i) ans = max(ans, dist[i]);
    return ans == INF ? -1 : ans;
}`},
"LC 684":{title:"Alternative: DFS Before Adding Edge",note:"O(n^2) worst case. Simpler graph-cycle explanation, but Union-Find is cleaner.",code:`vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    vector<vector<int>> graph(edges.size() + 1);
    function<bool(int,int,vector<int>&)> dfs = [&](int u, int target, vector<int>& seen) {
        if (u == target) return true;
        seen[u] = true;
        for (int v : graph[u])
            if (!seen[v] && dfs(v, target, seen)) return true;
        return false;
    };
    for (auto& e : edges) {
        vector<int> seen(edges.size() + 1, 0);
        if (dfs(e[0], e[1], seen)) return e;
        graph[e[0]].push_back(e[1]);
        graph[e[1]].push_back(e[0]);
    }
    return {};
}`}
});
})();
