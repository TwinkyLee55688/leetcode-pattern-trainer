const patterns=["Array / HashMap","Two Pointers","Sliding Window","HashMap / Prefix","Stack","Binary Search","Linked List","Tree DFS/BFS","Graph","Heap","Greedy","Dynamic Programming","Matrix","Backtracking","Bit Manipulation","Math"];
const problems=[
{id:"LC 1",title:"Two Sum",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample: nums = [2,7,11,15], target = 9 → [0,1].",signal:"target pair / complement / sum target → 先想 HashMap，一邊查 need，一邊存 current。",hints:["暴力法是枚舉 i, j，O(n²)。","掃描 nums[i] 時，真正想找的是 target - nums[i]。","map 存 value → index，而且先查再存，避免同一元素被用兩次。","duplicates 沒問題，因為 index 是分開的。"],interviewer:["Can you first describe the brute force solution?","How can you reduce the time complexity?","What if there are duplicate numbers?","Can you solve it in one pass?"],answer:["Clarify that we return indices, not values.","For each nums[i], compute need = target - nums[i].","If need was seen before, return previous index and i.","Store nums[i] after checking to avoid reusing the same element."],complexity:"O(n) time, O(n) space",code:`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,followups:["What if input is sorted? Use two pointers.","What if multiple answers are required?","What if memory is constrained?"],review:"看到 pair + target，先想 complement map。"},
{id:"LC 3",title:"Longest Substring Without Repeating Characters",difficulty:"Medium",pattern:"Sliding Window",prompt:"Given a string s, find the length of the longest substring without repeating characters.\n\nExample: s = abcabcbb → 3, because abc is the longest valid substring.",signal:"substring + longest + no repeating → Sliding Window。Window invariant：區間內沒有重複字元。",hints:["暴力法枚舉所有 substring 會太慢。","維護 [left, right]，right 每次加入一個字元。","如果 s[right] 在目前 window 裡重複，left 必須跳過上次出現位置。","left 只能往右，不能往回退。"],interviewer:["What is the invariant of your window?","When you see a repeated character, how do you move left?","Why should left never move backward?","Can you do it in O(n)?"],answer:["Maintain a window with no duplicate characters.","Use lastSeen char → index.","If lastSeen[c] >= left, update left = lastSeen[c] + 1.","Update answer after fixing the window."],complexity:"O(n) time, O(min(n, charset)) space",code:`int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> last;
    int left = 0, ans = 0;
    for (int right = 0; right < s.size(); ++right) {
        char c = s[right];
        if (last.count(c) && last[c] >= left) left = last[c] + 1;
        last[c] = right;
        ans = max(ans, right - left + 1);
    }
    return ans;
}`,followups:["What if input is Unicode?","Can you use array[128]?","How to handle streaming input?"],review:"duplicate 在 window 內才移 left；更新後 window 永遠合法。"},
{id:"LC 11",title:"Container With Most Water",difficulty:"Medium",pattern:"Two Pointers",secondaryPatterns:["Greedy"],patternReasons:{"Two Pointers":"The implementation is two pointers because it keeps one index at each end and moves one boundary per step.","Greedy":"The proof is greedy because every step discards the shorter side: keeping it while shrinking width cannot produce a better area."},prompt:"Given heights, choose two lines that form a container with the most water. Return the maximum area.",signal:"兩端選 pair + 面積受短邊限制 → Two Pointers + Greedy proof。",hints:["暴力枚舉所有 pair 是 O(n²)。","一開始用最大寬度 l=0, r=n-1。","面積由 min(height[l], height[r]) 限制。","寬度只會變小，所以要移動短邊才可能改善高度限制。"],interviewer:["Why does two-pointer work?","Why move the shorter side?","Can moving the taller side ever help?","What is the brute force complexity?"],answer:["Area = width * min(leftHeight, rightHeight).","Width decreases every step.","Only increasing the limiting height can improve the area.","Move the shorter side; moving taller side cannot improve the limiting height."],complexity:"O(n) time, O(1) space",code:`int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, ans = 0;
    while (l < r) {
        ans = max(ans, (r - l) * min(height[l], height[r]));
        if (height[l] < height[r]) ++l;
        else --r;
    }
    return ans;
}`,followups:["Return indices too?","Explain correctness in one minute.","What if heights can be negative?"],review:"寬度下降不可逆；只能期待限制邊變高，所以移短邊。"},
{id:"LC 15",title:"3Sum",difficulty:"Medium",pattern:"Two Pointers",prompt:"Given an integer array nums, return all unique triplets [a,b,c] such that a+b+c=0.",signal:"unique triplets + sum target → sort 後固定一個數，再 two pointers。重點是去重。",hints:["排序可以讓 duplicate skipping 和左右夾逼變容易。","固定 i，問題變成在右側找 two sum = -nums[i]。","sum 太小 left++，太大 right--。","找到答案後，要跳過相同 left/right 值。"],interviewer:["How do you avoid duplicate triplets?","Why sort first?","Can you do better than O(n²)?","What edge cases matter?"],answer:["Sort nums.","For each i, skip duplicate i.","Run two pointers on i+1..n-1.","After recording a triplet, skip duplicate left and right values."],complexity:"O(n²) time, O(1) extra space excluding output",code:`vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < nums.size(); ++i) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            long sum = (long)nums[i] + nums[l] + nums[r];
            if (sum < 0) ++l;
            else if (sum > 0) --r;
            else {
                res.push_back({nums[i], nums[l], nums[r]});
                ++l; --r;
                while (l < r && nums[l] == nums[l - 1]) ++l;
                while (l < r && nums[r] == nums[r + 1]) --r;
            }
        }
    }
    return res;
}`,followups:["How to solve 4Sum?","What if target is not zero?","Why use long for sum?"],review:"排序 → 固定一個 → two pointers；去重是關鍵。"},
{id:"LC 20",title:"Valid Parentheses",difficulty:"Easy",pattern:"Stack",prompt:"Given a string containing only brackets, determine whether every open bracket is closed by the same type and in the correct order.",signal:"括號 / 巢狀 / 最近未關閉 → Stack。",hints:["最近打開的括號必須最先被關閉。","這是 LIFO 結構。","可以 push expected closing char，讓比較更簡單。","最後 stack 必須為空。"],interviewer:["Why stack?","What do you push: opens or expected closes?","How handle early invalid?","Complexity?"],answer:["Use stack for last-open-first-close matching.","When seeing opening bracket, push expected close.","When seeing closing bracket, compare with top.","Return true only if stack is empty at the end."],complexity:"O(n) time, O(n) space",code:`bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else {
            if (st.empty() || st.top() != c) return false;
            st.pop();
        }
    }
    return st.empty();
}`,followups:["What if there are other characters?","Return first invalid index?","Support custom bracket pairs?"],review:"巢狀配對 → stack；push expected close 最乾淨。"},
{id:"LC 33",title:"Search in Rotated Sorted Array",difficulty:"Medium",pattern:"Binary Search",prompt:"Given a rotated sorted array and a target, return the target index in O(log n), or -1 if not found.",signal:"O(log n) + rotated sorted array → Binary Search 變形。每次至少一半有序。",hints:["雖然整體不是 sorted，但每次切半，至少有一半是 sorted。","用 nums[l] <= nums[mid] 判斷左半是否有序。","如果 target 在有序那半的範圍，就往那半找。","否則排除那半。"],interviewer:["How do you know which side is sorted?","How do you decide whether target lies in that side?","What about no rotation?","What about duplicates?"],answer:["At each step, one half must be sorted.","Identify sorted half by comparing nums[l] and nums[mid].","Check if target lies inside that sorted range.","Move boundaries accordingly."],complexity:"O(log n) time, O(1) space",code:`int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[l] <= nums[m]) {
            if (nums[l] <= target && target < nums[m]) r = m - 1;
            else l = m + 1;
        } else {
            if (nums[m] < target && target <= nums[r]) l = m + 1;
            else r = m - 1;
        }
    }
    return -1;
}`,followups:["What if duplicates exist?","Find minimum in rotated array?","Prove you discard a valid half."],review:"每步找出有序半邊，再判斷 target 是否落在裡面。"},
{id:"LC 49",title:"Group Anagrams",difficulty:"Medium",pattern:"Array / HashMap",prompt:"Given an array of strings, group the anagrams together.",signal:"分組 + 同構 key → HashMap key design。Anagram 共享 sorted string 或 frequency vector。",hints:["Anagram 的字母組成相同。","最簡單 key 是把字串排序後的結果。","map: key → vector of original strings。","若字串很長，可改用 26-count frequency key。"],interviewer:["What key identifies an anagram group?","Sorting key vs frequency key tradeoff?","What about Unicode or uppercase?","What is complexity?"],answer:["Anagrams share the same sorted string or same frequency vector.","Use sorted string as hashmap key for simplicity.","Push each original string into its group.","Frequency key can be O(k) for lowercase English."],complexity:"O(n * k log k) time with sorting, O(n*k) space",code:`vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (auto& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& [key, vals] : groups) res.push_back(move(vals));
    return res;
}`,followups:["Design frequency-vector key.","What if strings are huge?","What if alphabet is not fixed?"],review:"Anagram 分組核心是 key design；最穩是 sort key。"},
{id:"LC 53",title:"Maximum Subarray",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",signal:"contiguous subarray max/min → Kadane。狀態是 max sum ending here。",hints:["對每個位置，問：要延續前面的 subarray，還是從自己重新開始？","cur = max(nums[i], cur + nums[i])。","best 每一步都更新。","初始化要用 nums[0]，才能處理全負數。"],interviewer:["What does your DP state mean?","When should you start a new subarray?","What if all numbers are negative?","Can you return indices too?"],answer:["Let cur be max subarray sum ending at current position.","For each x, either extend previous subarray or start new at x.","Update global best each step.","Initialize with nums[0] to handle all-negative arrays."],complexity:"O(n) time, O(1) space",code:`int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}`,followups:["Return start/end indices?","What about circular array?","Can divide and conquer solve it?"],review:"連續 subarray：extend or restart。"},
{id:"LC 76",title:"Minimum Window Substring",difficulty:"Hard",pattern:"Sliding Window",prompt:"Given strings s and t, return the minimum window substring of s such that every character in t is included in the window.",signal:"substring + minimum + contains all required chars → Sliding Window with need/have counts。",hints:["先統計 t 裡每個字元需要幾個。","right 擴張直到 window 覆蓋需求。","合法後盡量縮 left，更新最短答案。","用 formed/required 追蹤有幾種字元已滿足。"],interviewer:["What makes a window valid?","How do you shrink safely?","How handle duplicate chars in t?","Why is it O(n)?"],answer:["Use a need map for t and a window map for s.","A window is valid when every required character count is satisfied.","Expand right until valid, then shrink left while preserving validity.","Each pointer moves at most n times."],complexity:"O(n + m) time, O(charset) space",code:`string minWindow(string s, string t) {
    unordered_map<char,int> need, window;
    for (char c : t) need[c]++;
    int required = need.size(), formed = 0;
    int left = 0, bestLen = INT_MAX, bestL = 0;
    for (int right = 0; right < s.size(); ++right) {
        char c = s[right];
        window[c]++;
        if (need.count(c) && window[c] == need[c]) formed++;
        while (formed == required) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestL = left;
            }
            char d = s[left++];
            window[d]--;
            if (need.count(d) && window[d] < need[d]) formed--;
        }
    }
    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}`,followups:["What if characters are Unicode?","What if case-insensitive?","Can you explain formed vs required?"],review:"最小覆蓋：先擴到合法，再縮到不能縮。"},
{id:"LC 98",title:"Validate Binary Search Tree",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, determine if it is a valid binary search tree.",signal:"BST validation 不能只比 parent；要帶 ancestor bounds。",hints:["只檢查 node.left < node < node.right 不夠。","每個 node 都有從祖先繼承來的合法範圍。","左子樹範圍變成 (low, node.val)。","右子樹範圍變成 (node.val, high)。"],interviewer:["Why is comparing only with parent insufficient?","What bounds should each node satisfy?","How handle INT_MIN/INT_MAX?","Are duplicates allowed?"],answer:["Each node must fall within a valid range inherited from ancestors.","Left child range is (low, node.val), right child range is (node.val, high).","Use long bounds to avoid integer boundary issues.","Use strict inequality if duplicates are invalid."],complexity:"O(n) time, O(h) space",code:`bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*, long, long)> dfs = [&](TreeNode* node, long low, long high) {
        if (!node) return true;
        if (node->val <= low || node->val >= high) return false;
        return dfs(node->left, low, node->val) && dfs(node->right, node->val, high);
    };
    return dfs(root, LONG_MIN, LONG_MAX);
}`,followups:["Can you solve with inorder traversal?","What if duplicates allowed on one side?","Recursion depth risk?"],review:"BST 題要想 ancestor bounds，不只 parent。"},
{id:"LC 102",title:"Binary Tree Level Order Traversal",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given a binary tree, return the level order traversal of its nodes' values.",signal:"level by level / shortest depth / 層序 → BFS queue。",hints:["Level order 表示一層一層處理。","Queue 支援先進先出。","每輪先記錄 queue size，這就是該層節點數。","處理該層時，把 children 推進 queue。"],interviewer:["Why BFS instead of DFS?","How do you separate levels?","What if root is null?","Complexity?"],answer:["Use a queue starting from root.","For each level, process exactly queue.size() nodes.","Append left/right children for the next level.","Return collected levels."],complexity:"O(n) time, O(width) space",code:`vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    queue<TreeNode*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        ans.push_back(level);
    }
    return ans;
}`,followups:["Zigzag traversal?","Right side view?","Average of levels?"],review:"一層一層 → queue BFS + 固定 size。"},
{id:"LC 128",title:"Longest Consecutive Sequence",difficulty:"Medium",pattern:"Array / HashMap",prompt:"Given an unsorted array, return the length of the longest consecutive elements sequence in O(n).",signal:"O(n) + consecutive sequence → HashSet，只從 sequence start 擴張。",hints:["排序是 O(n log n)，但題目要求 O(n)。","把所有數字放進 set。","只有當 x-1 不存在時，x 才是 sequence start。","從 start 往 x+1, x+2 擴張。"],interviewer:["Why not sort?","How ensure O(n)?","How detect start of sequence?","What about duplicates?"],answer:["Put all numbers into a hash set.","Only start counting from x if x-1 is not in the set.","Then expand while x+1 exists.","Each number is visited at most once as part of a sequence."],complexity:"O(n) time, O(n) space",code:`int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int best = 0;
    for (int x : s) {
        if (!s.count(x - 1)) {
            int cur = x, len = 1;
            while (s.count(cur + 1)) { cur++; len++; }
            best = max(best, len);
        }
    }
    return best;
}`,followups:["What if numbers are huge?","Can you return the sequence?","Why duplicates don't matter?"],review:"只從起點擴張，避免重複掃描。"},
{id:"LC 146",title:"LRU Cache",difficulty:"Medium",pattern:"HashMap / Prefix",prompt:"Design a data structure that supports get and put in O(1), evicting the least recently used key when capacity is exceeded.",signal:"O(1) get/put + recency order → HashMap + Doubly Linked List。",hints:["HashMap 可以 O(1) 找 key，但不能維護使用順序。","Doubly linked list 可以 O(1) 移動節點。","最近使用的放 head，最久沒用的放 tail。","get 和 put 都要把節點移到 head。"],interviewer:["Why not just hashmap?","Why doubly linked list?","What happens on get?","How evict LRU?"],answer:["Use hashmap key → node pointer for O(1) lookup.","Use doubly linked list to maintain recency order.","On get/put existing, move node to front.","When capacity exceeded, remove tail node."],complexity:"O(1) get, O(1) put",code:`class LRUCache {
    int cap;
    list<pair<int,int>> dll;
    unordered_map<int, list<pair<int,int>>::iterator> pos;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!pos.count(key)) return -1;
        dll.splice(dll.begin(), dll, pos[key]);
        return pos[key]->second;
    }
    void put(int key, int value) {
        if (pos.count(key)) {
            pos[key]->second = value;
            dll.splice(dll.begin(), dll, pos[key]);
            return;
        }
        if (dll.size() == cap) {
            int oldKey = dll.back().first;
            pos.erase(oldKey);
            dll.pop_back();
        }
        dll.push_front({key, value});
        pos[key] = dll.begin();
    }
};`,followups:["Thread safety?","LFU Cache?","Implement without STL list?"],review:"O(1) lookup + O(1) recency move = hashmap + doubly linked list。"},
{id:"LC 200",title:"Number of Islands",difficulty:"Medium",pattern:"Graph",prompt:"Given a 2D grid of '1' land and '0' water, count the number of islands.",signal:"grid connected components → DFS/BFS/Union Find。",hints:["每個 land cell 是一個 graph node。","上下左右相鄰代表 edge。","遇到未 visited 的 land，答案 +1，然後把整座島標記掉。","可用 DFS 或 BFS。"],interviewer:["What graph is implied by the grid?","How avoid revisiting cells?","DFS vs BFS tradeoff?","What is complexity?"],answer:["Treat grid as an implicit graph.","When finding an unvisited land cell, start DFS/BFS and mark all connected land.","Each DFS/BFS call consumes one island.","Each cell is visited at most once."],complexity:"O(mn) time, O(mn) worst-case space",code:`int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), ans = 0;
    function<void(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    };
    for (int r = 0; r < m; ++r)
        for (int c = 0; c < n; ++c)
            if (grid[r][c] == '1') { ans++; dfs(r,c); }
    return ans;
}`,followups:["Use BFS instead?","What if grid cannot be mutated?","Dynamic islands? Use Union Find."],review:"Grid 島嶼 = connected components；發現一塊 land 就 flood fill。"},
{id:"LC 207",title:"Course Schedule",difficulty:"Medium",pattern:"Graph",prompt:"There are numCourses courses and prerequisites [a,b] meaning b before a. Determine whether you can finish all courses.",signal:"prerequisite / dependency / can finish → directed graph cycle detection / topological sort。",hints:["課程是 nodes，先修關係是 directed edges。","如果有 cycle，就無法完成。","用 indegree + queue 做 topological sort。","能 pop 掉所有課代表沒有 cycle。"],interviewer:["How model prerequisites as graph?","How detect cycle?","Why indegree zero courses first?","DFS alternative?"],answer:["Build adjacency list and indegree.","Push all zero-indegree courses into queue.","Pop course, decrement neighbors' indegree.","If processed count equals numCourses, no cycle."],complexity:"O(V+E) time, O(V+E) space",code:`bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indeg(numCourses, 0);
    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        indeg[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (indeg[i] == 0) q.push(i);
    int count = 0;
    while (!q.empty()) {
        int cur = q.front(); q.pop(); count++;
        for (int nxt : graph[cur]) if (--indeg[nxt] == 0) q.push(nxt);
    }
    return count == numCourses;
}`,followups:["Return valid course order?","DFS cycle detection?","What if prerequisites update dynamically?"],review:"dependency 能不能完成 = 有向圖是否有環。"},
{id:"LC 215",title:"Kth Largest Element in an Array",difficulty:"Medium",pattern:"Heap",prompt:"Given an integer array nums and an integer k, return the kth largest element.",signal:"kth largest / top k → Heap 或 Quickselect。面試先講 heap，再優化 quickselect。",hints:["排序可做但 O(n log n)。","維持 size k 的 min-heap。","heap top 是目前第 k 大。","掃完後 top 就是答案。"],interviewer:["Sorting vs heap vs quickselect?","What is heap size?","Why min-heap for kth largest?","Expected vs worst-case?"],answer:["Use min-heap of size k.","Push each number; if heap size exceeds k, pop smallest.","After processing all numbers, heap top is kth largest.","Quickselect can be expected O(n)."],complexity:"O(n log k) time, O(k) space",code:`int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if (pq.size() > k) pq.pop();
    }
    return pq.top();
}`,followups:["Implement quickselect.","Streaming input?","kth smallest?"],review:"Top K：min-heap size k；第 k 大在 top。"},
{id:"LC 238",title:"Product of Array Except Self",difficulty:"Medium",pattern:"HashMap / Prefix",prompt:"Given an array nums, return an array answer such that answer[i] is the product of all elements except nums[i], without division.",signal:"product except self without division → prefix/suffix decomposition.",hints:["answer[i] equals product on the left times product on the right.","First pass stores prefix products in ans.","Second pass multiplies a running suffix product from the right.","The output array does not count as extra space."],interviewer:["Can you solve without division?","Can you reduce extra space?","What about zeros?","Walk through [1,2,3,4]."],answer:["Build output as prefix products.","Scan from right while maintaining suffix product.","Multiply suffix into ans[i].","Zeros are handled naturally without division."],complexity:"O(n) time, O(1) extra space excluding output",code:`vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, 1);
    int prefix = 1;
    for (int i = 0; i < n; ++i) { ans[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for (int i = n - 1; i >= 0; --i) { ans[i] *= suffix; suffix *= nums[i]; }
    return ans;
}`,followups:["Why is prefix initialized to 1?","What if overflow?","Can this be one conceptual pass from both ends?"],review:"除自己以外 = 左側資訊 × 右側資訊。"},
{id:"LC 121",title:"Best Time to Buy and Sell Stock",difficulty:"Easy",pattern:"Greedy",prompt:"Given prices where prices[i] is the stock price on day i, return the maximum profit from one buy and one sell.\n\nExample: prices = [7,1,5,3,6,4] → 5.",signal:"single transaction + max profit → track minimum price so far.",hints:["You must buy before selling.","For each day, ask: what if I sell today?","The best buy before today is the minimum price seen so far.","Update profit and min price in one pass."],interviewer:["Why is one pass enough?","What if prices only decrease?","Can you return buy/sell days?","How would multiple transactions change it?"],answer:["Track minPrice seen so far.","For each price, compute price - minPrice.","Update best profit.","Then update minPrice."],complexity:"O(n) time, O(1) space",code:`int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, best = 0;
    for (int p : prices) {
        best = max(best, p - minPrice);
        minPrice = min(minPrice, p);
    }
    return best;
}`,followups:["Return buy/sell indices?","Allow multiple transactions?","Allow transaction fee?"],review:"For one transaction, the best sell today depends only on the minimum price before today."},
{id:"LC 125",title:"Valid Palindrome",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given a string s, return true if it is a palindrome after converting uppercase letters to lowercase and removing non-alphanumeric characters.\n\nExample: \"A man, a plan, a canal: Panama\" → true.",signal:"palindrome after filtering → two pointers from both ends.",hints:["Skip non-alphanumeric characters.","Compare lowercase characters from both ends.","Move inward after each successful comparison.","Mismatch means false."],interviewer:["How do you skip punctuation?","What about case sensitivity?","Can you avoid building a new string?","Complexity?"],answer:["Use l and r pointers.","Skip invalid chars on both sides.","Compare lowercase values.","Continue until pointers cross."],complexity:"O(n) time, O(1) space",code:`bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) ++l;
        while (l < r && !isalnum(s[r])) --r;
        if (tolower(s[l]) != tolower(s[r])) return false;
        ++l; --r;
    }
    return true;
}`,followups:["Build cleaned string first?","Support Unicode?","Return first mismatch index?"],review:"Palindrome comparisons naturally use two pointers from the ends."},
{id:"LC 217",title:"Contains Duplicate",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given an integer array nums, return true if any value appears at least twice.\n\nExample: nums = [1,2,3,1] → true.",signal:"detect repeated value → hash set membership.",hints:["If a value was seen before, answer is true.","A set gives O(1) average lookup.","Scan once.","If scan ends, no duplicate exists."],interviewer:["Sorting vs set?","Memory tradeoff?","What if input is huge?","Can you return the duplicate?"],answer:["Create a set.","For each number, check if it already exists.","If yes, return true.","Otherwise insert and continue."],complexity:"O(n) time, O(n) space",code:`bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}`,followups:["What if memory is constrained?","Return all duplicates?","Streaming input?"],review:"Duplicate detection is a direct set-membership problem."},
{id:"LC 242",title:"Valid Anagram",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given two strings s and t, return true if t is an anagram of s.\n\nExample: s = anagram, t = nagaram → true.",signal:"same character multiset → frequency count.",hints:["Anagrams must have equal length.","Count characters in s.","Subtract characters in t.","All counts must end at zero."],interviewer:["Sorting vs counting?","What if Unicode?","Case sensitivity?","Complexity?"],answer:["Check lengths first.","Use frequency counts.","Increment for s and decrement for t.","Return false if any count is nonzero."],complexity:"O(n) time, O(1) space for lowercase English",code:`bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    vector<int> cnt(26, 0);
    for (int i = 0; i < s.size(); ++i) {
        cnt[s[i] - 'a']++;
        cnt[t[i] - 'a']--;
    }
    for (int x : cnt) if (x != 0) return false;
    return true;
}`,followups:["Support Unicode?","Use sorting?","Find grouped anagrams?"],review:"Anagram equality is character-frequency equality."},
{id:"LC 226",title:"Invert Binary Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, invert the tree and return its root.\n\nExample: swap every left and right child recursively.",signal:"tree transformation → DFS recursion or BFS traversal.",hints:["Each node can be handled independently.","Swap left and right children.","Then invert both subtrees.","Base case is null."],interviewer:["DFS or BFS?","Can you do it iteratively?","What is recursion depth?","Does this mutate input?"],answer:["If root is null, return null.","Swap root->left and root->right.","Recursively invert children.","Return root."],complexity:"O(n) time, O(h) space",code:`TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    return root;
}`,followups:["Iterative BFS version?","Avoid mutation?","Recursion depth risk?"],review:"A tree transform usually applies the same operation to each node."},
{id:"LC 347",title:"Top K Frequent Elements",difficulty:"Medium",pattern:"Heap",prompt:"Given an integer array nums and an integer k, return the k most frequent elements.\n\nExample: nums = [1,1,1,2,2,3], k = 2 → [1,2].",signal:"top k by frequency → frequency map + heap or bucket sort.",hints:["First count frequencies.","Then keep the k highest frequencies.","A min-heap of size k discards weaker candidates.","Return heap contents."],interviewer:["Heap vs bucket sort?","What if k is large?","Streaming input?","Complexity?"],answer:["Build frequency map.","Use min-heap ordered by frequency.","Keep heap size at most k.","Extract keys."],complexity:"O(n log k) time, O(n) space",code:`vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    for (auto& [x, f] : freq) {
        pq.push({f, x});
        if (pq.size() > k) pq.pop();
    }
    vector<int> ans;
    while (!pq.empty()) { ans.push_back(pq.top().second); pq.pop(); }
    return ans;
}`,followups:["Bucket sort solution?","What if data is streaming?","Return sorted by frequency?"],review:"Top k after counting is either heap or bucket sort."}
];
const extraProblems=[
{id:"LC 88",title:"Merge Sorted Array",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given two sorted arrays nums1 and nums2, merge nums2 into nums1 in nondecreasing order in-place.",signal:"two sorted arrays + in-place merge points to reverse two pointers from the end.",hints:["If you merge from the front, you overwrite useful values in nums1.","Start from the last valid element of nums1, the last element of nums2, and the final write slot.","Write the larger current value to the back.","Copy remaining nums2 values if any are left."],interviewer:["Why merge from the back?","What if nums2 is exhausted first?","What if nums1 valid part is exhausted first?","Complexity?"],answer:["Set i=m-1, j=n-1, k=m+n-1.","Compare nums1[i] and nums2[j].","Write the larger value into nums1[k].","Continue until nums2 is fully copied."],complexity:"O(m+n) time, O(1) space",code:`void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,followups:["Can you merge into a new array?","What if arrays are descending?","What if nums1 has no buffer?"],review:"In-place sorted merge is safest from the back."},
{id:"LC 27",title:"Remove Element",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given an array nums and a value val, remove all occurrences of val in-place and return the new length.",signal:"in-place filter points to a slow write pointer.",hints:["You only need the prefix of kept values to be valid.","Use one pointer to scan and one pointer to write kept elements.","When nums[i] != val, write it to nums[k].","Return k."],interviewer:["Does order matter?","What should the returned length mean?","Can you do it in-place?","Complexity?"],answer:["Initialize write index k = 0.","Scan every value x in nums.","If x is not val, assign nums[k++] = x.","Return k as the new length."],complexity:"O(n) time, O(1) space",code:`int removeElement(vector<int>& nums, int val) {
    int k = 0;
    for (int x : nums) {
        if (x != val) nums[k++] = x;
    }
    return k;
}`,followups:["If order does not matter, can you reduce writes?","How test all elements removed?","How test none removed?"],review:"In-place filtering uses a write pointer."},
{id:"LC 26",title:"Remove Duplicates from Sorted Array",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given a sorted array nums, remove duplicates in-place so each unique element appears once.",signal:"sorted + remove duplicates points to comparing with the last written unique value.",hints:["Sorted order makes duplicates adjacent.","Keep a write pointer for the next unique slot.","Write nums[i] only when it differs from nums[k-1].","Return the count of unique values."],interviewer:["Why does sortedness matter?","What does k represent?","What about empty input?","Complexity?"],answer:["If nums is empty, return 0.","Start k=1 because nums[0] is unique.","Scan from i=1.","When nums[i] != nums[k-1], write nums[k++] = nums[i]."],complexity:"O(n) time, O(1) space",code:`int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int k = 1;
    for (int i = 1; i < nums.size(); ++i)
        if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
    return k;
}`,followups:["Allow each value twice?","What if array is unsorted?","Can you preserve order?"],review:"Sorted duplicate removal is a write-pointer invariant."},
{id:"LC 80",title:"Remove Duplicates from Sorted Array II",difficulty:"Medium",pattern:"Two Pointers",prompt:"Given a sorted array nums, remove duplicates in-place so each unique element appears at most twice.",signal:"sorted + allow at most k copies points to checking the value k positions behind the write pointer.",hints:["The first two elements are always allowed.","For each new value, compare it with nums[k-2].","If it differs, keeping it will not create three copies.","Write and advance k."],interviewer:["How generalize to at most K copies?","Why compare with k-2?","What about length <= 2?","Complexity?"],answer:["Use write index k = 0.","For each x, keep it if k < 2 or x != nums[k-2].","Assign nums[k++] = x when kept.","Return k."],complexity:"O(n) time, O(1) space",code:`int removeDuplicates(vector<int>& nums) {
    int k = 0;
    for (int x : nums) {
        if (k < 2 || x != nums[k - 2]) nums[k++] = x;
    }
    return k;
}`,followups:["Generalize to at most K duplicates.","What if input is unsorted?","Why is order preserved?"],review:"For at most two copies, the guard is the value two kept slots behind."},
{id:"LC 169",title:"Majority Element",difficulty:"Easy",pattern:"Greedy",prompt:"Given an array nums, return the element that appears more than floor(n / 2) times.",signal:"majority element points to Boyer-Moore vote cancellation.",hints:["The majority survives pairwise cancellation with other values.","Maintain a candidate and a count.","When count is zero, choose the current value as candidate.","Same value increments; different value decrements."],interviewer:["Why does cancellation work?","Do we need a second validation pass?","What if no majority exists?","Complexity?"],answer:["Initialize candidate and count.","Reset candidate when count becomes zero.","Increment count for candidate, decrement otherwise.","Return candidate because the majority is guaranteed."],complexity:"O(n) time, O(1) space",code:`int majorityElement(vector<int>& nums) {
    int cand = 0, count = 0;
    for (int x : nums) {
        if (count == 0) cand = x;
        count += (x == cand) ? 1 : -1;
    }
    return cand;
}`,followups:["What if majority is not guaranteed?","Find elements appearing more than n/3?","Use hashmap baseline?"],review:"Majority survives cancellation."},
{id:"LC 189",title:"Rotate Array",difficulty:"Medium",pattern:"Array / HashMap",prompt:"Given an array nums, rotate it to the right by k steps in-place.",signal:"array rotation in-place points to reverse whole, reverse prefix, reverse suffix.",hints:["Normalize k with k %= n.","A right rotation moves the last k values to the front.","Reversing the whole array puts those k values first but reversed.","Reverse each part to restore internal order."],interviewer:["Why k modulo n?","Can you do O(1) space?","What if k is 0?","Alternative using cycles?"],answer:["Normalize k by n.","Reverse the whole array.","Reverse the first k elements.","Reverse the remaining n-k elements."],complexity:"O(n) time, O(1) space",code:`void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,followups:["Use cyclic replacements?","Rotate left instead?","What if nums is empty?"],review:"Rotation can be decomposed into three reversals."},
{id:"LC 55",title:"Jump Game",difficulty:"Medium",pattern:"Greedy",prompt:"Given nums where nums[i] is the max jump length from i, return whether you can reach the last index.",signal:"reachability with max jump points to maintaining the farthest reachable index.",hints:["Track the farthest index reachable so far.","If the current index is beyond farthest, it is unreachable.","Update farthest with i + nums[i].","If farthest reaches the last index, return true."],interviewer:["What invariant do you maintain?","When do you fail early?","Why greedy works?","Complexity?"],answer:["Initialize farthest = 0.","Scan i from 0.","If i > farthest, return false.","Update farthest = max(farthest, i + nums[i])."],complexity:"O(n) time, O(1) space",code:`bool canJump(vector<int>& nums) {
    int farthest = 0;
    for (int i = 0; i < nums.size(); ++i) {
        if (i > farthest) return false;
        farthest = max(farthest, i + nums[i]);
    }
    return true;
}`,followups:["Return minimum jumps?","Return one path?","What if jumps can be negative?"],review:"Reachability is captured by the farthest reachable index."},
{id:"LC 45",title:"Jump Game II",difficulty:"Medium",pattern:"Greedy",prompt:"Given nums where nums[i] is the max jump length from i, return the minimum number of jumps to reach the last index.",signal:"minimum jumps over ranges points to BFS-like greedy layers.",hints:["Think of current jump as covering a range [0, currentEnd].","Within that range, compute the farthest next range.","When i reaches currentEnd, you must take another jump.","Update currentEnd to farthest."],interviewer:["Why is this like BFS by levels?","When do you increment jumps?","What if n is 1?","Complexity?"],answer:["Track currentEnd, farthest, and jumps.","For each i before the last index, update farthest.","When i == currentEnd, increment jumps and set currentEnd = farthest.","Return jumps."],complexity:"O(n) time, O(1) space",code:`int jump(vector<int>& nums) {
    int jumps = 0, currentEnd = 0, farthest = 0;
    for (int i = 0; i < nums.size() - 1; ++i) {
        farthest = max(farthest, i + nums[i]);
        if (i == currentEnd) {
            ++jumps;
            currentEnd = farthest;
        }
    }
    return jumps;
}`,followups:["Recover the jump path?","What if end may be unreachable?","Compare with DP."],review:"Each jump covers one greedy layer of reachable indices."},
{id:"LC 274",title:"H-Index",difficulty:"Medium",pattern:"Array / HashMap",prompt:"Given citations, return the researcher's h-index.",signal:"bounded count threshold points to bucket counting by citation count.",hints:["h-index only ranges from 0 to n.","Citations above n can be grouped into bucket n.","Count papers by capped citation count.","Scan buckets downward accumulating papers with at least h citations."],interviewer:["Why cap citations at n?","Sorting vs counting?","What does accumulated count mean?","Complexity?"],answer:["Create n+1 buckets.","For each citation c, increment bucket[min(c,n)].","Scan h from n down to 0 while accumulating papers.","Return first h where papers >= h."],complexity:"O(n) time, O(n) space",code:`int hIndex(vector<int>& citations) {
    int n = citations.size();
    vector<int> bucket(n + 1, 0);
    for (int c : citations) bucket[min(c, n)]++;
    int papers = 0;
    for (int h = n; h >= 0; --h) {
        papers += bucket[h];
        if (papers >= h) return h;
    }
    return 0;
}`,followups:["Use sorting?","What if citations are already sorted?","Explain h-index in plain English."],review:"When the answer is between 0 and n, bucket counts are natural."},
{id:"LC 380",title:"Insert Delete GetRandom O(1)",difficulty:"Medium",pattern:"Array / HashMap",prompt:"Design a set that supports insert, remove, and getRandom in average O(1) time.",signal:"O(1) random access + O(1) delete points to vector plus hashmap index.",hints:["A vector supports O(1) random index access.","A hashmap supports O(1) lookup by value.","Deleting from the middle of a vector is expensive.","Swap the removed value with the last value, update its index, then pop."],interviewer:["Why do we need both array and hashmap?","How remove in O(1)?","How make getRandom uniform?","What about duplicates?"],answer:["Store values in a vector.","Map value to its index in the vector.","For removal, swap target with the last value and update the moved value's index.","Pop back and erase the removed value."],complexity:"O(1) average time for insert, remove, and getRandom",code:`class RandomizedSet {
    vector<int> vals;
    unordered_map<int,int> pos;
public:
    bool insert(int val) {
        if (pos.count(val)) return false;
        pos[val] = vals.size();
        vals.push_back(val);
        return true;
    }
    bool remove(int val) {
        if (!pos.count(val)) return false;
        int i = pos[val], last = vals.back();
        vals[i] = last;
        pos[last] = i;
        vals.pop_back();
        pos.erase(val);
        return true;
    }
    int getRandom() {
        return vals[rand() % vals.size()];
    }
};`,followups:["Support duplicates?","Why is getRandom uniform?","Thread safety?"],review:"Random O(1) needs array indexing; delete O(1) needs index map plus swap-with-last."},
{id:"LC 134",title:"Gas Station",difficulty:"Medium",pattern:"Greedy",prompt:"Given gas and cost arrays, return the starting gas station index to complete the circuit, or -1.",signal:"circular feasibility with total surplus points to greedy restart.",hints:["If total gas is less than total cost, no solution exists.","Track current tank while scanning.","If tank becomes negative at i, no station from the current start through i can be valid.","Restart at i+1."],interviewer:["Why can you discard all starts in the failed segment?","What proves uniqueness?","What if total is negative?","Complexity?"],answer:["Track total surplus and current tank.","Add gas[i] - cost[i] at each station.","If tank drops below zero, set start = i + 1 and reset tank.","Return start only if total surplus is nonnegative."],complexity:"O(n) time, O(1) space",code:`int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.size(); ++i) {
        int diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}`,followups:["Explain the restart proof.","What if multiple starts are allowed?","Return remaining gas too?"],review:"A failed segment cannot contain the answer, so greedily restart after it."},
{id:"LC 42",title:"Trapping Rain Water",difficulty:"Hard",pattern:"Two Pointers",prompt:"Given elevation bars, compute how much rain water can be trapped after raining.",signal:"water level depends on min(left max, right max), which supports two pointers.",hints:["Water above i is limited by the shorter side maximum.","Maintain leftMax and rightMax.","Move the side with smaller current height because that side is the limiting side.","Add trapped water when current height is below the side max."],interviewer:["Why move the smaller side?","Can you solve with prefix/suffix arrays?","What about monotonic stack?","Complexity?"],answer:["Use l and r pointers with leftMax and rightMax.","If height[l] < height[r], process left side.","Otherwise process right side.","Accumulate maxSide - height[index]."],complexity:"O(n) time, O(1) space",code:`int trap(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            leftMax = max(leftMax, height[l]);
            water += leftMax - height[l];
            ++l;
        } else {
            rightMax = max(rightMax, height[r]);
            water += rightMax - height[r];
            --r;
        }
    }
    return water;
}`,followups:["Use stack instead?","Use prefix/suffix arrays?","Handle very large heights?"],review:"The smaller boundary determines the safe side to process."},
{id:"LC 13",title:"Roman to Integer",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given a Roman numeral string, convert it to an integer.",signal:"symbol parsing with subtractive pairs points to comparing current and next values.",hints:["Normally Roman values are added.","If a smaller value appears before a larger value, it should be subtracted.","Map each symbol to its value.","Scan left to right and compare with the next symbol."],interviewer:["How handle IV and IX?","Can you scan from right to left?","What are valid input assumptions?","Complexity?"],answer:["Map Roman characters to values.","For each character, compare value with the next value.","Subtract if current is smaller than next; otherwise add.","Return the accumulated sum."],complexity:"O(n) time, O(1) space",code:`int romanToInt(string s) {
    unordered_map<char,int> val{{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int ans = 0;
    for (int i = 0; i < s.size(); ++i) {
        int cur = val[s[i]];
        int next = (i + 1 < s.size()) ? val[s[i + 1]] : 0;
        ans += cur < next ? -cur : cur;
    }
    return ans;
}`,followups:["Validate invalid Roman numerals?","Convert integer to Roman?","Scan from right to left?"],review:"Subtractive notation is detected by current value smaller than next value."},
{id:"LC 12",title:"Integer to Roman",difficulty:"Medium",pattern:"Greedy",prompt:"Given an integer, convert it to a Roman numeral.",signal:"canonical numeral construction points to greedy subtraction from largest symbols.",hints:["Roman numerals are built from largest values first.","Include subtractive pairs such as 900, 400, 90, 40, 9, and 4.","Append a symbol while its value fits.","Subtract that value and continue."],interviewer:["Why include subtractive pairs?","Why greedy works?","What is the input range?","Complexity?"],answer:["Create value-symbol pairs in descending order.","For each pair, append the symbol while num >= value.","Subtract value each time.","Return the built string."],complexity:"O(1) time, O(1) space because input range is bounded",code:`string intToRoman(int num) {
    vector<pair<int,string>> vals{{1000,"M"},{900,"CM"},{500,"D"},{400,"CD"},{100,"C"},{90,"XC"},{50,"L"},{40,"XL"},{10,"X"},{9,"IX"},{5,"V"},{4,"IV"},{1,"I"}};
    string ans;
    for (auto& [v, sym] : vals) {
        while (num >= v) {
            ans += sym;
            num -= v;
        }
    }
    return ans;
}`,followups:["Roman to integer?","Validate range?","Can you use digit lookup tables?"],review:"Roman generation is greedy over canonical symbols including subtractive pairs."},
{id:"LC 58",title:"Length of Last Word",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given a string s consisting of words and spaces, return the length of the last word.",signal:"last token after trailing spaces points to scanning from the end.",hints:["Ignore trailing spaces first.","Then count characters until the previous space or start of string.","No extra split is needed.","Return the count."],interviewer:["How handle trailing spaces?","What if there is one word?","Can you avoid extra memory?","Complexity?"],answer:["Start at the last index.","Move left while s[i] is a space.","Count non-space characters while moving left.","Return the count."],complexity:"O(n) time, O(1) space",code:`int lengthOfLastWord(string s) {
    int i = s.size() - 1;
    while (i >= 0 && s[i] == ' ') --i;
    int len = 0;
    while (i >= 0 && s[i] != ' ') { --i; ++len; }
    return len;
}`,followups:["Use stringstream?","What if tabs count as spaces?","What if string is empty?"],review:"For the last word, scan from the end and skip trailing spaces."},
{id:"LC 14",title:"Longest Common Prefix",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given an array of strings, return the longest common prefix among them.",signal:"common prefix across strings points to vertical character comparison.",hints:["Compare characters column by column.","Use the first string as the reference.","Stop when a string ends or a mismatch appears.","Return the prefix before the mismatch."],interviewer:["What if the list is empty?","What if one string is empty?","Horizontal vs vertical scan?","Complexity?"],answer:["Use strs[0] as the reference.","For each character position, compare across every string.","If any string ends or mismatches, return the prefix so far.","If no mismatch, return the first string."],complexity:"O(total compared characters) time, O(1) extra space",code:`string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    for (int i = 0; i < strs[0].size(); ++i) {
        char c = strs[0][i];
        for (string& s : strs) {
            if (i == s.size() || s[i] != c) return strs[0].substr(0, i);
        }
    }
    return strs[0];
}`,followups:["Use sorting?","Use trie?","Streaming strings?"],review:"A common prefix fails at the first column mismatch."},
{id:"LC 151",title:"Reverse Words in a String",difficulty:"Medium",pattern:"Two Pointers",prompt:"Given a string s, reverse the order of words while removing extra spaces.",signal:"words + spaces normalization points to scanning tokens from the end.",hints:["The output has single spaces between words and no leading/trailing spaces.","Scan from the end to naturally reverse word order.","Skip spaces, then capture a word boundary.","Append words with one separator."],interviewer:["How handle multiple spaces?","Can you do it in-place?","What is a word?","Complexity?"],answer:["Scan index i from the end.","Skip spaces.","Find the start of the current word.","Append that word to the answer with one space if needed.","Continue until the string is consumed."],complexity:"O(n) time, O(n) space",code:`string reverseWords(string s) {
    string ans;
    int i = s.size() - 1;
    while (i >= 0) {
        while (i >= 0 && s[i] == ' ') --i;
        if (i < 0) break;
        int j = i;
        while (i >= 0 && s[i] != ' ') --i;
        if (!ans.empty()) ans += ' ';
        ans += s.substr(i + 1, j - i);
    }
    return ans;
}`,followups:["Do it in-place for mutable char array?","Preserve multiple spaces?","Handle tabs?"],review:"Scanning words from the end reverses order while normalizing spaces."},
{id:"LC 6",title:"Zigzag Conversion",difficulty:"Medium",pattern:"Array / HashMap",secondaryPatterns:["Simulation"],patternReasons:{"Array / HashMap":"The clean default stores characters in row buckets, then concatenates the buckets.","Simulation":"You simulate the pen moving down rows, then diagonally back up."},prompt:"Given a string s and numRows, pretend you write the string with a pen that moves down the rows, then bounces diagonally back up, repeating that path. Return the text read row by row. The output is not the order you write characters; it is row 0, then row 1, then row 2, and so on.",signal:"Track the row path, not columns. For 3 rows the path is 0,1,2,1,0,1,2,1...; append each char to that row, then join rows.",hints:["Forget geometry first: for numRows = 3, the row index pattern is 0,1,2,1,0,1,2,1,... .","PAYPALISHIRING becomes row0 = PAHN, row1 = APLSIIG, row2 = YIR.","The final answer is row0 + row1 + row2, so PAHN + APLSIIG + YIR.","Code only needs current row and direction: dir = +1 going down, dir = -1 going up."],interviewer:["Can you list the row index sequence for numRows = 3?","What happens when numRows is 1?","Why is row simulation O(n)?","Can you derive the cycle-length formula?"],answer:["Make numRows buckets, one string per visual row.","Move a row pointer through the repeating path: 0 -> 1 -> ... -> numRows-1 -> numRows-2 -> ... -> 0.","Put each character into the bucket for the current row.","At the top or bottom row, reverse direction.","Join all row buckets from top to bottom."],complexity:"O(n) time, O(n) space",code:`string convert(string s, int numRows) {
    if (numRows == 1 || s.size() <= numRows) return s;
    vector<string> rows(numRows);
    int row = 0, dir = 1;
    for (char c : s) {
        rows[row] += c;
        if (row == 0) dir = 1;
        else if (row == numRows - 1) dir = -1;
        row += dir;
    }
    string ans;
    for (string& r : rows) ans += r;
    return ans;
}`,followups:["Use arithmetic jumps?","Memory optimization?","Edge case numRows=1?"],review:"Mental model: generate row numbers first, then group characters by row. The drawn zigzag is only a visualization."},
{id:"LC 28",title:"Find the Index of the First Occurrence in a String",difficulty:"Easy",pattern:"Sliding Window",prompt:"Given haystack and needle, return the index of the first occurrence of needle in haystack, or -1.",signal:"substring search can start with a fixed-size window comparison.",hints:["Check every possible start from 0 to n-m.","Compare characters until mismatch.","Return the first full match.","If none match, return -1."],interviewer:["What if needle is longer than haystack?","Can you use KMP?","What is brute force complexity?","What about empty needle?"],answer:["Let n and m be lengths.","For each start i where i + m <= n, compare needle against haystack.","If every character matches, return i.","Return -1 if no start works."],complexity:"O(n*m) worst-case time, O(1) space",code:`int strStr(string haystack, string needle) {
    int n = haystack.size(), m = needle.size();
    for (int i = 0; i + m <= n; ++i) {
        int j = 0;
        while (j < m && haystack[i + j] == needle[j]) ++j;
        if (j == m) return i;
    }
    return -1;
}`,followups:["Implement KMP?","Use rolling hash?","Case-insensitive search?"],review:"The baseline is fixed-window matching; KMP is the follow-up optimization."},
{id:"LC 383",title:"Ransom Note",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given ransomNote and magazine, return whether ransomNote can be constructed using letters from magazine.",signal:"can construct from characters points to frequency counts.",hints:["Each magazine character can be used once.","Count available characters from magazine.","Consume characters needed by ransomNote.","If any count becomes negative, return false."],interviewer:["Why counting works?","What is the alphabet size?","Can you early exit?","Complexity?"],answer:["Build a count array for magazine.","For each character in ransomNote, decrement its count.","If a count drops below zero, return false.","Return true after all characters are consumed."],complexity:"O(n+m) time, O(1) space for lowercase English",code:`bool canConstruct(string ransomNote, string magazine) {
    vector<int> cnt(26, 0);
    for (char c : magazine) cnt[c - 'a']++;
    for (char c : ransomNote) {
        if (--cnt[c - 'a'] < 0) return false;
    }
    return true;
}`,followups:["Support Unicode?","Return missing letters?","Streaming magazine input?"],review:"Construction from characters is availability counting."},
{id:"LC 205",title:"Isomorphic Strings",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given strings s and t, determine if characters in s can be replaced to get t with a one-to-one mapping.",signal:"one-to-one character mapping points to checking both directions.",hints:["A character in s must always map to the same character in t.","Two different s characters cannot map to the same t character.","Track mapping s->t and used target characters.","Reject conflicts."],interviewer:["Why one map is not enough?","How handle repeated characters?","What if alphabets are Unicode?","Complexity?"],answer:["If lengths differ, return false.","Maintain map from s character to t character.","Maintain a set or reverse map for used t characters.","Reject if either direction conflicts."],complexity:"O(n) time, O(charset) space",code:`bool isIsomorphic(string s, string t) {
    vector<int> st(256, -1), ts(256, -1);
    for (int i = 0; i < s.size(); ++i) {
        unsigned char a = s[i], b = t[i];
        if (st[a] == -1 && ts[b] == -1) {
            st[a] = b;
            ts[b] = a;
        } else if (st[a] != b || ts[b] != a) return false;
    }
    return true;
}`,followups:["Use last-seen pattern arrays?","Unicode support?","Return the mapping?"],review:"Isomorphism requires consistent mapping in both directions."},
{id:"LC 290",title:"Word Pattern",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given a pattern and a string s, determine if s follows the same bijective word pattern.",signal:"pattern-to-word bijection points to two-way mapping.",hints:["Split s into words.","The number of words must match pattern length.","Each pattern char maps to exactly one word.","Each word maps back to exactly one pattern char."],interviewer:["Why need two maps?","How handle different lengths?","What is the delimiter?","Complexity?"],answer:["Split s by spaces into words.","If counts differ, return false.","Maintain char->word and word->char maps.","Reject any conflict while scanning pairs."],complexity:"O(n) time, O(n) space",code:`bool wordPattern(string pattern, string s) {
    stringstream ss(s);
    vector<string> words;
    string w;
    while (ss >> w) words.push_back(w);
    if (words.size() != pattern.size()) return false;
    unordered_map<char,string> cw;
    unordered_map<string,char> wc;
    for (int i = 0; i < pattern.size(); ++i) {
        char c = pattern[i];
        string word = words[i];
        if (cw.count(c) && cw[c] != word) return false;
        if (wc.count(word) && wc[word] != c) return false;
        cw[c] = word;
        wc[word] = c;
    }
    return true;
}`,followups:["Avoid storing all words?","Allow multiple spaces?","Return the mapping?"],review:"Word pattern is the same bijection idea as isomorphic strings."},
{id:"LC 202",title:"Happy Number",difficulty:"Easy",pattern:"Linked List",prompt:"Given an integer n, return whether repeatedly replacing n by the sum of squares of its digits eventually reaches 1.",signal:"repeated state transition with possible cycle points to cycle detection.",hints:["The process either reaches 1 or loops.","You can store seen values in a set.","Floyd cycle detection also works.","If slow reaches 1, the number is happy."],interviewer:["Why must it cycle?","Set vs Floyd?","What is the next-state function?","Complexity?"],answer:["Define next(n) as sum of squared digits.","Use slow = next(n), fast = next(next(n)).","Advance slow once and fast twice.","Return true if either reaches 1; false if they meet elsewhere."],complexity:"O(log n) space with set or O(1) space with Floyd; iterations are bounded for int input",code:`int nextHappy(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}

bool isHappy(int n) {
    int slow = n, fast = nextHappy(n);
    while (fast != 1 && slow != fast) {
        slow = nextHappy(slow);
        fast = nextHappy(nextHappy(fast));
    }
    return fast == 1;
}`,followups:["Use a hash set instead?","Prove bounded states?","Find the cycle members?"],review:"Repeated transformations either terminate or cycle."},
{id:"LC 66",title:"Plus One",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given digits representing a non-negative integer, add one and return the resulting digits.",signal:"manual addition points to carry propagation from the end.",hints:["Start from the last digit.","If digit is less than 9, increment and return.","If digit is 9, set it to 0 and continue carrying.","If all digits were 9, insert 1 at the front."],interviewer:["How handle [9,9,9]?","Can you do it in-place?","What about leading zeroes?","Complexity?"],answer:["Scan from right to left.","Increment the first digit below 9 and return.","Set 9s to 0 as carry propagates.","If carry remains, insert 1 at the beginning."],complexity:"O(n) time, O(1) extra space excluding output growth",code:`vector<int> plusOne(vector<int>& digits) {
    for (int i = digits.size() - 1; i >= 0; --i) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    digits.insert(digits.begin(), 1);
    return digits;
}`,followups:["Add arbitrary integer k?","Digits stored reversed?","Linked-list representation?"],review:"Addition is carry propagation from the least significant digit."},
{id:"LC 69",title:"Sqrt(x)",difficulty:"Easy",pattern:"Binary Search",prompt:"Given a non-negative integer x, return the integer square root rounded down.",signal:"monotonic predicate m*m <= x points to binary search on answer.",hints:["The answer is between 0 and x.","Predicate m <= x / m avoids overflow.","If m*m <= x, m is feasible and maybe too small.","Otherwise m is too large."],interviewer:["How avoid overflow?","Why binary search applies?","What about x < 2?","Complexity?"],answer:["Set l=1, r=x/2 for x>=2.","Binary search for the largest m with m <= x/m.","Store feasible m as ans.","Return ans."],complexity:"O(log x) time, O(1) space",code:`int mySqrt(int x) {
    if (x < 2) return x;
    int l = 1, r = x / 2, ans = 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (m <= x / m) {
            ans = m;
            l = m + 1;
        } else r = m - 1;
    }
    return ans;
}`,followups:["Return decimal precision?","Use Newton's method?","Avoid division?"],review:"Integer sqrt is the largest feasible value under a monotonic predicate."},
{id:"LC 135",title:"Candy",difficulty:"Hard",pattern:"Greedy",prompt:"There are children with ratings. Give each child at least one candy, and children with higher ratings than adjacent children must get more candies. Return the minimum candies needed.",signal:"local neighbor constraints from both directions point to two greedy passes.",hints:["Every child starts with one candy.","A left-to-right pass satisfies higher-than-left-neighbor constraints.","A right-to-left pass satisfies higher-than-right-neighbor constraints.","Take the max needed by both directions."],interviewer:["Why one pass is not enough?","What invariant does each pass satisfy?","How handle equal ratings?","Complexity?"],answer:["Initialize candies with 1 for everyone.","Scan left to right; if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.","Scan right to left; if ratings[i] > ratings[i+1], update candies[i] with max(candies[i], candies[i+1] + 1).","Sum candies."],complexity:"O(n) time, O(n) space",code:`int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> candies(n, 1);
    for (int i = 1; i < n; ++i)
        if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
    for (int i = n - 2; i >= 0; --i)
        if (ratings[i] > ratings[i + 1]) candies[i] = max(candies[i], candies[i + 1] + 1);
    return accumulate(candies.begin(), candies.end(), 0);
}`,followups:["Can you do O(1) space?","Why max in the second pass?","What if equal ratings are adjacent?"],review:"Bidirectional neighbor constraints usually need two directional passes."},
{id:"LC 68",title:"Text Justification",difficulty:"Hard",pattern:"Greedy",prompt:"Given words and maxWidth, format text so each line has exactly maxWidth characters and is fully justified.",signal:"line packing with exact width points to greedy word grouping plus spacing rules.",hints:["Greedily fit as many words as possible into the current line.","For the last line or a single-word line, left-justify.","Otherwise distribute spaces evenly across gaps.","Earlier gaps receive the extra one-space remainder."],interviewer:["How decide which words fit a line?","How handle the last line?","How distribute extra spaces?","What about one-word lines?"],answer:["Build each line greedily by adding words while the minimum required spaces fit.","If it is the last line or has one word, join words with single spaces and pad the right.","Otherwise compute total spaces, base spaces per gap, and extra spaces.","Append words and distributed spaces to reach maxWidth."],complexity:"O(total characters) time, O(maxWidth) extra work per line",code:`vector<string> fullJustify(vector<string>& words, int maxWidth) {
    vector<string> ans;
    for (int i = 0; i < words.size(); ) {
        int j = i, len = 0;
        while (j < words.size() && len + words[j].size() + (j - i) <= maxWidth) {
            len += words[j].size();
            ++j;
        }
        int gaps = j - i - 1;
        string line;
        if (j == words.size() || gaps == 0) {
            for (int k = i; k < j; ++k) {
                if (k > i) line += ' ';
                line += words[k];
            }
            line += string(maxWidth - line.size(), ' ');
        } else {
            int spaces = maxWidth - len;
            int base = spaces / gaps, extra = spaces % gaps;
            for (int k = i; k < j; ++k) {
                line += words[k];
                if (k < j - 1) line += string(base + (k - i < extra), ' ');
            }
        }
        ans.push_back(line);
        i = j;
    }
    return ans;
}`,followups:["How test exact line width?","What if words can be longer than maxWidth?","Can you stream lines?"],review:"Text justification is greedy grouping followed by careful space distribution."},
{id:"LC 35",title:"Search Insert Position",difficulty:"Easy",pattern:"Binary Search",prompt:"Given a sorted array of distinct integers and a target, return the index if found, or the index where it should be inserted.",signal:"sorted array + insertion position points to lower_bound binary search.",hints:["The answer is the first index whose value is greater than or equal to target.","Maintain a half-open search range [l, r).","If nums[m] is less than target, discard the left side including m.","Otherwise keep m as a possible answer by moving r to m."],interviewer:["What exactly does the returned index mean?","Why use l < r instead of l <= r?","What if target is larger than all values?","Complexity?"],answer:["Search for the first position with nums[i] >= target.","Use l=0 and r=nums.size().","When nums[m] < target, set l=m+1.","Otherwise set r=m; return l."],complexity:"O(log n) time, O(1) space",code:`int searchInsert(vector<int>& nums, int target) {
    int l = 0, r = nums.size();
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] < target) l = m + 1;
        else r = m;
    }
    return l;
}`,followups:["Return upper_bound instead?","What if duplicates are allowed?","Use STL lower_bound?"],review:"Insertion position is lower_bound: first value not less than target."},
{id:"LC 56",title:"Merge Intervals",difficulty:"Medium",pattern:"Greedy",secondaryPatterns:["Array / HashMap"],patternReasons:{"Greedy":"After sorting by start, overlapping intervals can be greedily merged into the current end.","Array / HashMap":"This is an interval array transformation; sorting the array creates the structure needed for merging."},prompt:"Given an array of intervals, merge all overlapping intervals and return the non-overlapping result.",signal:"overlapping intervals points to sorting by start, then greedily extending the current interval.",hints:["Sort intervals by start time.","Keep the last merged interval as the current active interval.","If the next interval starts before or at current end, merge by extending end.","Otherwise start a new merged interval."],interviewer:["Why sort first?","What counts as overlap?","How handle touching intervals like [1,4] and [4,5]?","Complexity?"],answer:["Sort intervals by start.","Initialize the answer with the first interval.","For each next interval, compare its start with the last merged end.","Merge if overlapping; otherwise append it."],complexity:"O(n log n) time, O(n) output space",code:`vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;
    for (auto& in : intervals) {
        if (ans.empty() || in[0] > ans.back()[1]) ans.push_back(in);
        else ans.back()[1] = max(ans.back()[1], in[1]);
    }
    return ans;
}`,followups:["What if intervals are already sorted?","How handle open intervals?","Can you merge streaming intervals?"],review:"Sort by start, then the only interval that can overlap the next one is the last merged interval."},
{id:"LC 57",title:"Insert Interval",difficulty:"Medium",pattern:"Greedy",secondaryPatterns:["Array / HashMap"],patternReasons:{"Greedy":"Process intervals in order: copy before, merge overlaps, copy after.","Array / HashMap":"The input is a sorted interval array; the solution is a structured array scan."},prompt:"Given non-overlapping intervals sorted by start and a new interval, insert and merge it if necessary.",signal:"sorted non-overlapping intervals + insertion points to three phases: before, merge, after.",hints:["Copy intervals ending before the new interval starts.","Merge every interval that overlaps the new interval.","After overlap ends, append the merged new interval.","Copy the remaining intervals unchanged."],interviewer:["Why are there three phases?","How do you define overlap?","What if the new interval goes at the end?","Complexity?"],answer:["Scan intervals with index i.","Append all intervals with end < newStart.","Merge while start <= newEnd, expanding the new interval.","Append merged new interval, then append the rest."],complexity:"O(n) time, O(n) output space",code:`vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> ans;
    int i = 0, n = intervals.size();
    while (i < n && intervals[i][1] < newInterval[0]) ans.push_back(intervals[i++]);
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        ++i;
    }
    ans.push_back(newInterval);
    while (i < n) ans.push_back(intervals[i++]);
    return ans;
}`,followups:["What if intervals are unsorted?","Insert many intervals?","Can this be done in-place?"],review:"Because intervals are sorted and non-overlapping, insertion naturally splits into before, overlap, and after."},
{id:"LC 155",title:"Min Stack",difficulty:"Medium",pattern:"Stack",prompt:"Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",signal:"stack operations + current minimum points to storing extra min state with each push.",hints:["A normal stack can return top but not minimum in O(1).","For every pushed value, also store the minimum up to that point.","When popping, the old minimum automatically disappears with that frame.","Top and getMin read from the last frame."],interviewer:["Why not scan for minimum on getMin?","What state should each stack entry store?","How handle duplicate minimum values?","Complexity?"],answer:["Store pairs of {value, currentMin}.","On push, currentMin is min(value, previousMin).","On pop, remove the top pair.","top returns value; getMin returns currentMin."],complexity:"O(1) time for all operations, O(n) space",code:`class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int val) {
        int mn = st.empty() ? val : min(val, st.top().second);
        st.push({val, mn});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,followups:["Can you store minimums in a second stack?","How handle duplicate mins?","Can you reduce memory?"],review:"Augment each stack frame with the minimum that was true at that moment."},
{id:"LC 150",title:"Evaluate Reverse Polish Notation",difficulty:"Medium",pattern:"Stack",prompt:"Given tokens in Reverse Polish Notation, evaluate the expression and return the integer result.",signal:"postfix expression means every operator consumes the most recent two operands, so use a stack.",hints:["Numbers are pushed onto the stack.","When you see an operator, pop the right operand first, then the left operand.","Compute left op right and push the result back.","At the end, the stack top is the answer."],interviewer:["Why stack?","Why does pop order matter for subtraction and division?","How handle negative numbers?","Complexity?"],answer:["Scan tokens left to right.","Push integer tokens.","For an operator, pop b then a, compute a op b, and push it.","Return the remaining stack value."],complexity:"O(n) time, O(n) space",code:`int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for (string& t : tokens) {
        if (t=="+" || t=="-" || t=="*" || t=="/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (t=="+") st.push(a + b);
            else if (t=="-") st.push(a - b);
            else if (t=="*") st.push(a * b);
            else st.push(a / b);
        } else st.push(stoi(t));
    }
    return st.top();
}`,followups:["Support more operators?","Convert infix to postfix?","What about overflow?"],review:"RPN is tailor-made for a stack: operators consume the latest operands."},
{id:"LC 141",title:"Linked List Cycle",difficulty:"Easy",pattern:"Linked List",prompt:"Given the head of a linked list, determine whether the list has a cycle.",signal:"linked list + cycle detection points to slow and fast pointers.",hints:["A visited set works but uses extra memory.","Use slow moving one step and fast moving two steps.","If there is a cycle, fast eventually catches slow.","If fast reaches null, there is no cycle."],interviewer:["Why do slow and fast meet in a cycle?","What if the list has one node?","Can you solve with O(1) space?","Can you find the cycle entry?"],answer:["Initialize slow and fast at head.","Move slow one step and fast two steps while possible.","If they ever meet, return true.","If fast reaches null, return false."],complexity:"O(n) time, O(1) space",code:`bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,followups:["Find cycle entry?","Remove the cycle?","Use a hash set instead?"],review:"Different speeds turn a cycle into an eventual meeting point."},
{id:"LC 2",title:"Add Two Numbers",difficulty:"Medium",pattern:"Linked List",prompt:"Given two non-empty linked lists representing reversed non-negative integers, add the numbers and return the sum as a linked list.",signal:"digit-by-digit addition over linked lists points to carry propagation with a dummy head.",hints:["The digits are already reversed, so process from head to tail.","Maintain a carry just like manual addition.","Use a dummy head to simplify appending result nodes.","Continue while either list remains or carry is nonzero."],interviewer:["Why does reversed order help?","How handle different lengths?","What if final carry remains?","Complexity?"],answer:["Create a dummy result node and carry=0.","While l1, l2, or carry exists, add available digits plus carry.","Create a node with sum % 10.","Update carry=sum/10 and advance pointers."],complexity:"O(max(m,n)) time, O(max(m,n)) space for output",code:`ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy;
    ListNode* cur = &dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = carry;
        if (l1) { sum += l1->val; l1 = l1->next; }
        if (l2) { sum += l2->val; l2 = l2->next; }
        carry = sum / 10;
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
    }
    return dummy.next;
}`,followups:["What if digits are forward order?","Can you avoid allocating new nodes?","Handle very long numbers?"],review:"Reversed linked-list addition is manual carry propagation with pointer advancement."},
{id:"LC 104",title:"Maximum Depth of Binary Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, return its maximum depth.",signal:"tree height asks for combining child answers, so DFS depth recursion is natural.",hints:["An empty tree has depth 0.","The depth of a node is 1 plus the deeper child depth.","This is a classic postorder DFS.","BFS level counting is also valid."],interviewer:["What is the base case?","DFS or BFS?","What is recursion depth?","Complexity?"],answer:["Return 0 for null.","Recursively compute left depth and right depth.","Return 1 + max(left, right).","The answer at root is the maximum depth."],complexity:"O(n) time, O(h) space",code:`int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,followups:["Use iterative BFS?","Minimum depth difference?","Handle very skewed trees?"],review:"Tree depth is one plus the larger child depth."},
{id:"LC 199",title:"Binary Tree Right Side View",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given a binary tree, return the values visible from the right side.",signal:"visible by level points to level order traversal and taking the rightmost node of each level.",hints:["Right side view needs one value per depth.","BFS can process each level and record the last node.","DFS can visit right before left and record first seen depth.","BFS is very direct for explaining."],interviewer:["Why one value per level?","BFS vs DFS tradeoff?","What if root is null?","Complexity?"],answer:["Use a queue for level order traversal.","For each level, process exactly queue.size() nodes.","Record the value of the last node in that level.","Push children for the next level."],complexity:"O(n) time, O(width) space",code:`vector<int> rightSideView(TreeNode* root) {
    vector<int> ans;
    queue<TreeNode*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            if (i == sz - 1) ans.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return ans;
}`,followups:["DFS right-first version?","Left side view?","Top view in a binary tree?"],review:"Right side view is the last node seen at each BFS level."},
{id:"LC 208",title:"Implement Trie",difficulty:"Medium",pattern:"Array / HashMap",secondaryPatterns:["Tree DFS/BFS"],patternReasons:{"Array / HashMap":"Each node maps characters to child nodes; fixed lowercase input can use an array of 26 children.","Tree DFS/BFS":"A trie is a prefix tree, so operations walk a tree path by characters."},prompt:"Implement a Trie with insert, search, and startsWith operations for lowercase words.",signal:"prefix queries point to a trie: one node per character along a path.",hints:["Each trie node needs children and an isWord flag.","Insert walks or creates child nodes for every character.","Search requires the full word path and isWord=true.","startsWith only requires the prefix path to exist."],interviewer:["Why not just use a hash set?","What state does each node store?","Difference between search and startsWith?","Complexity?"],answer:["Define TrieNode with 26 child pointers and isWord.","Insert creates missing nodes along the word.","Search walks the word and checks isWord at the end.","startsWith walks the prefix and does not require isWord."],complexity:"O(L) time per operation, O(total inserted characters) space",code:`class Trie {
    struct Node {
        array<Node*, 26> child{};
        bool isWord = false;
    };
    Node* root;
    Node* walk(string s) {
        Node* cur = root;
        for (char c : s) {
            int i = c - 'a';
            if (!cur->child[i]) return nullptr;
            cur = cur->child[i];
        }
        return cur;
    }
public:
    Trie() { root = new Node(); }
    void insert(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->child[i]) cur->child[i] = new Node();
            cur = cur->child[i];
        }
        cur->isWord = true;
    }
    bool search(string word) {
        Node* node = walk(word);
        return node && node->isWord;
    }
    bool startsWith(string prefix) {
        return walk(prefix) != nullptr;
    }
};`,followups:["Support delete?","Use unordered_map children for Unicode?","Autocomplete words with a prefix?"],review:"Prefix lookup becomes walking a character path in a trie."}
];
problems.push(...extraProblems);
const moreLc150Problems=[
{id:"LC 167",title:"Two Sum II - Input Array Is Sorted",difficulty:"Medium",pattern:"Two Pointers",prompt:"Given a 1-indexed sorted integer array numbers and a target, return the two indices whose values add up to target.",signal:"sorted pair sum points to two pointers from both ends.",hints:["The array is already sorted.","If the sum is too small, move left rightward.","If the sum is too large, move right leftward.","Return 1-indexed positions."],interviewer:["Why two pointers instead of hashmap?","Why does moving left increase the sum?","What about duplicates?","Complexity?"],answer:["Set l=0 and r=n-1.","Compute sum=numbers[l]+numbers[r].","Move l if sum is too small; move r if too large.","Return {l+1,r+1} when equal."],complexity:"O(n) time, O(1) space",code:`vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0, r = numbers.size() - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return {l + 1, r + 1};
        if (sum < target) ++l;
        else --r;
    }
    return {};
}`,followups:["What if array is not sorted?","Return all pairs?","Use binary search for each value?"],review:"Sorted pair search lets comparisons tell which pointer cannot work."},
{id:"LC 209",title:"Minimum Size Subarray Sum",difficulty:"Medium",pattern:"Sliding Window",prompt:"Given positive integers nums and target, return the minimal length of a contiguous subarray with sum at least target.",signal:"positive numbers + minimum length subarray points to sliding window shrink after valid.",hints:["All numbers are positive, so expanding right only increases sum.","Once sum >= target, shrink left to minimize length.","Record length before removing left.","If no valid window exists, return 0."],interviewer:["Why do positives matter?","When do you shrink?","What if negatives are allowed?","Complexity?"],answer:["Maintain left and running sum.","Expand right by adding nums[right].","While sum >= target, update best and subtract nums[left++].","Return 0 if best was never updated."],complexity:"O(n) time, O(1) space",code:`int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, best = INT_MAX;
    for (int right = 0; right < nums.size(); ++right) {
        sum += nums[right];
        while (sum >= target) {
            best = min(best, right - left + 1);
            sum -= nums[left++];
        }
    }
    return best == INT_MAX ? 0 : best;
}`,followups:["What if negative values exist?","Solve with prefix sums and binary search?","Return the subarray indices?"],review:"Positive values make the window monotonic enough to shrink safely."},
{id:"LC 219",title:"Contains Duplicate II",difficulty:"Easy",pattern:"Array / HashMap",prompt:"Given nums and k, return true if two equal values have indices whose absolute difference is at most k.",signal:"duplicate within distance k points to hashmap last seen index or a fixed-size set window.",hints:["You need both value equality and index distance.","Store the most recent index for each value.","When seeing a repeated value, check i-last[value].","Update the last index every time."],interviewer:["Why store last index?","Can a sliding set work?","What if k is zero?","Complexity?"],answer:["Use a map value -> last index.","For each i, if nums[i] was seen and i-last <= k, return true.","Update last index to i.","Return false after scanning."],complexity:"O(n) time, O(n) space",code:`bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_map<int,int> last;
    for (int i = 0; i < nums.size(); ++i) {
        if (last.count(nums[i]) && i - last[nums[i]] <= k) return true;
        last[nums[i]] = i;
    }
    return false;
}`,followups:["Use a sliding window set?","Return the pair of indices?","What if k is very large?"],review:"Nearby duplicate means remember where each value appeared most recently."},
{id:"LC 228",title:"Summary Ranges",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given a sorted unique integer array nums, summarize consecutive ranges.",signal:"sorted unique array + consecutive runs points to scanning run starts and ends.",hints:["Each range starts at the first unconsumed number.","Advance while the next value is current+1.","Single-value ranges use just that value.","Multi-value ranges use start->end."],interviewer:["Why is sortedness useful?","How handle singletons?","What about integer overflow?","Complexity?"],answer:["Scan with index i.","Mark start=nums[i].","Advance i while consecutive values continue.","Format start alone or start->end."],complexity:"O(n) time, O(1) extra space excluding output",code:`vector<string> summaryRanges(vector<int>& nums) {
    vector<string> ans;
    for (int i = 0; i < nums.size(); ) {
        int start = nums[i];
        while (i + 1 < nums.size() && (long)nums[i + 1] == (long)nums[i] + 1) ++i;
        if (start == nums[i]) ans.push_back(to_string(start));
        else ans.push_back(to_string(start) + "->" + to_string(nums[i]));
        ++i;
    }
    return ans;
}`,followups:["What if duplicates exist?","Return ranges as pairs?","Handle unsorted input?"],review:"Consecutive range compression is run-length scanning on a sorted array."},
{id:"LC 452",title:"Minimum Number of Arrows to Burst Balloons",difficulty:"Medium",pattern:"Greedy",prompt:"Given balloon intervals, return the minimum arrows needed so every interval is hit by some arrow.",signal:"interval covering with minimum points points to sorting by end and shooting greedily.",hints:["One arrow at position x bursts every interval containing x.","Sort balloons by end coordinate.","Shoot at the earliest possible end.","If the next start is after the arrow, need a new arrow."],interviewer:["Why sort by end?","Why shoot at the current end?","What about overlapping endpoints?","Complexity?"],answer:["Sort intervals by end.","Initialize arrows=0 and current arrow position.","For each interval, if no arrow covers it, shoot at its end.","Covered intervals need no extra arrow."],complexity:"O(n log n) time, O(1) extra space",code:`int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int arrows = 0;
    long arrow = LONG_MIN;
    for (auto& p : points) {
        if (p[0] > arrow) {
            ++arrows;
            arrow = p[1];
        }
    }
    return arrows;
}`,followups:["Merge intervals instead?","What if coordinates overflow int?","Return arrow positions?"],review:"For interval stabbing, the earliest ending interval forces the safest arrow position."},
{id:"LC 71",title:"Simplify Path",difficulty:"Medium",pattern:"Stack",prompt:"Given an absolute Unix path, return its canonical simplified path.",signal:"path components with .. undo previous directory points to stack.",hints:["Split the path by slash.","Ignore empty tokens and dot tokens.","For .., pop one directory if possible.","For normal names, push them."],interviewer:["Why stack?","How handle multiple slashes?","What if path tries to go above root?","Complexity?"],answer:["Parse components separated by '/'.","Ignore empty and '.'.","For '..', pop if stack is non-empty.","Join stack with '/' and prepend root slash."],complexity:"O(n) time, O(n) space",code:`string simplifyPath(string path) {
    vector<string> st;
    string token;
    stringstream ss(path);
    while (getline(ss, token, '/')) {
        if (token.empty() || token == ".") continue;
        if (token == "..") { if (!st.empty()) st.pop_back(); }
        else st.push_back(token);
    }
    string ans;
    for (string& dir : st) ans += "/" + dir;
    return ans.empty() ? "/" : ans;
}`,followups:["Support relative paths?","Handle spaces in names?","Avoid stringstream?"],review:"Canonical path is stack normalization over directory tokens."},
{id:"LC 21",title:"Merge Two Sorted Lists",difficulty:"Easy",pattern:"Linked List",prompt:"Given two sorted linked lists, merge them into one sorted linked list.",signal:"two sorted streams points to two pointers plus a dummy head.",hints:["Use a dummy head to simplify appending.","Compare current nodes from both lists.","Append the smaller node and advance that list.","Attach the remaining list at the end."],interviewer:["Why use a dummy node?","Do you allocate new nodes?","What if one list is empty?","Complexity?"],answer:["Create dummy and tail pointer.","While both lists exist, append the smaller node.","Advance the chosen list and tail.","Attach the non-empty remainder."],complexity:"O(m+n) time, O(1) extra space",code:`ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy;
    ListNode* tail = &dummy;
    while (list1 && list2) {
        if (list1->val <= list2->val) { tail->next = list1; list1 = list1->next; }
        else { tail->next = list2; list2 = list2->next; }
        tail = tail->next;
    }
    tail->next = list1 ? list1 : list2;
    return dummy.next;
}`,followups:["Merge k sorted lists?","Recursive version?","Preserve original nodes?"],review:"Dummy-head merging removes special cases at the output head."},
{id:"LC 19",title:"Remove Nth Node From End of List",difficulty:"Medium",pattern:"Linked List",prompt:"Given the head of a linked list, remove the nth node from the end and return the head.",signal:"nth from end points to two pointers with a fixed gap.",hints:["Use a dummy node before head to handle removing the first node.","Advance fast n+1 steps from dummy.","Move slow and fast together until fast is null.","slow then points before the node to remove."],interviewer:["Why use a dummy node?","Why gap n+1 from dummy?","What if removing head?","Complexity?"],answer:["Create dummy pointing to head.","Move fast n+1 steps from dummy.","Move fast and slow together until fast is null.","Delete slow->next and return dummy.next."],complexity:"O(n) time, O(1) space",code:`ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode *slow = &dummy, *fast = &dummy;
    for (int i = 0; i <= n; ++i) fast = fast->next;
    while (fast) {
        slow = slow->next;
        fast = fast->next;
    }
    slow->next = slow->next->next;
    return dummy.next;
}`,followups:["Two-pass solution?","Return removed value?","Handle invalid n?"],review:"A fixed gap converts nth-from-end into one forward scan."},
{id:"LC 100",title:"Same Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given roots of two binary trees, return whether they are structurally identical and have the same values.",signal:"compare two trees recursively by matching nullness, value, left, and right.",hints:["Both null means equal at this branch.","Only one null means mismatch.","Values must match.","Both left subtrees and both right subtrees must match."],interviewer:["DFS or BFS?","What is the base case?","How handle nulls?","Complexity?"],answer:["If both nodes are null, return true.","If one is null, return false.","Check values are equal.","Recurse on left and right children."],complexity:"O(n) time, O(h) space",code:`bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p->val == q->val && isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,followups:["Iterative queue version?","Compare serialized forms?","Allow approximate equality?"],review:"Same tree requires same structure and same value at every matched node."},
{id:"LC 101",title:"Symmetric Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, determine whether it is a mirror of itself.",signal:"symmetry means compare left subtree against right subtree in mirrored order.",hints:["This is not just comparing left and right values.","Mirror comparison pairs the outside children together and the inside children together.","Use helper(a,b): a and b are mirrors if values match and outer/inner children match.","Null handling is the base case."],interviewer:["What does mirror comparison mean?","Recursive or iterative?","What are the null cases?","Complexity?"],answer:["Write mirror(a,b).","Both null returns true; one null returns false.","Values must match.","Check mirror(a->left,b->right) and mirror(a->right,b->left)."],complexity:"O(n) time, O(h) space",code:`bool isMirror(TreeNode* a, TreeNode* b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a->val == b->val && isMirror(a->left, b->right) && isMirror(a->right, b->left);
}

bool isSymmetric(TreeNode* root) {
    return !root || isMirror(root->left, root->right);
}`,followups:["Iterative queue version?","N-ary tree symmetry?","Return first mismatch?"],review:"Symmetry compares outer children together and inner children together."},
{id:"LC 112",title:"Path Sum",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given a binary tree and targetSum, return whether a root-to-leaf path sums to targetSum.",signal:"root-to-leaf condition with running sum points to DFS carrying remaining target.",hints:["Subtract the current node value from the remaining target.","Only leaf nodes can complete a path.","At a leaf, check remaining equals leaf value.","Recurse into left or right."],interviewer:["Why leaf matters?","DFS or BFS?","How handle negative values?","Complexity?"],answer:["If root is null, return false.","If root is a leaf, compare targetSum with root->val.","Recurse left or right with targetSum-root->val.","Return true if either branch succeeds."],complexity:"O(n) time, O(h) space",code:`bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    if (!root->left && !root->right) return targetSum == root->val;
    return hasPathSum(root->left, targetSum - root->val) || hasPathSum(root->right, targetSum - root->val);
}`,followups:["Return all paths?","Use iterative stack?","Can values be negative?"],review:"Path sum is DFS with remaining target, but success is only checked at leaves."},
{id:"LC 129",title:"Sum Root to Leaf Numbers",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given a binary tree where each node contains a digit, return the sum of all root-to-leaf numbers.",signal:"path value built from root to leaf points to DFS carrying current number.",hints:["Each step shifts current value by one decimal digit.","newValue = current*10 + node->val.","Only add to answer at leaves.","DFS naturally carries the path value."],interviewer:["What state do you carry?","Why only add at leaves?","DFS or BFS?","Complexity?"],answer:["DFS with current numeric prefix.","At each node, update cur=cur*10+val.","If leaf, return cur.","Otherwise return left sum plus right sum."],complexity:"O(n) time, O(h) space",code:`int sumNumbers(TreeNode* root) {
    function<int(TreeNode*, int)> dfs = [&](TreeNode* node, int cur) {
        if (!node) return 0;
        cur = cur * 10 + node->val;
        if (!node->left && !node->right) return cur;
        return dfs(node->left, cur) + dfs(node->right, cur);
    };
    return dfs(root, 0);
}`,followups:["Return the actual numbers?","Handle overflow?","Iterative stack version?"],review:"Root-to-leaf numbers are path-state DFS with decimal accumulation."},
{id:"LC 105",title:"Construct Binary Tree from Preorder and Inorder Traversal",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given preorder and inorder traversal arrays, construct the binary tree.",signal:"preorder gives root first; inorder splits left and right subtrees.",hints:["The first preorder value is the root.","Find that root in inorder to know left subtree size.","Use a hashmap value -> inorder index for O(1) splits.","Recursively build left and right ranges."],interviewer:["Why need inorder?","How avoid O(n^2) root lookup?","What are the recursive bounds?","Complexity?"],answer:["Map inorder values to indices.","Use preorder index to pick the next root.","Split inorder range at root index.","Recursively build left range then right range."],complexity:"O(n) time, O(n) space",code:`TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int,int> pos;
    for (int i = 0; i < inorder.size(); ++i) pos[inorder[i]] = i;
    int pre = 0;
    function<TreeNode*(int,int)> build = [&](int l, int r) -> TreeNode* {
        if (l > r) return nullptr;
        int val = preorder[pre++];
        TreeNode* root = new TreeNode(val);
        int m = pos[val];
        root->left = build(l, m - 1);
        root->right = build(m + 1, r);
        return root;
    };
    return build(0, inorder.size() - 1);
}`,followups:["Handle duplicate values?","Build from inorder and postorder?","Iterative construction?"],review:"Preorder chooses roots; inorder tells how big each subtree is."},
{id:"LC 230",title:"Kth Smallest Element in a BST",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given the root of a BST and integer k, return the kth smallest value.",signal:"BST kth smallest points to inorder traversal, because inorder is sorted.",hints:["Inorder traversal of a BST is ascending.","Stop once you visit k nodes.","Iterative stack avoids recursion if desired.","The kth visited value is the answer."],interviewer:["Why inorder?","Can you stop early?","What if tree changes often?","Complexity?"],answer:["Traverse left, node, right.","Decrement k when visiting a node.","When k reaches zero, return that node value.","Use stack or recursion."],complexity:"O(h+k) time, O(h) space",code:`int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    while (root || !st.empty()) {
        while (root) { st.push(root); root = root->left; }
        root = st.top(); st.pop();
        if (--k == 0) return root->val;
        root = root->right;
    }
    return -1;
}`,followups:["Support frequent updates?","Find kth largest?","Use subtree counts?"],review:"BST inorder converts tree order into sorted order."},
{id:"LC 236",title:"Lowest Common Ancestor of a Binary Tree",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given a binary tree and two nodes p and q, return their lowest common ancestor.",signal:"ancestor discovery in a general binary tree points to DFS returning whether p or q was found below.",hints:["If root is null, p, or q, return root.","Search left and right subtrees.","If both sides return non-null, root is the LCA.","Otherwise return the non-null side."],interviewer:["Why does returning p or q work?","What if one node is ancestor of the other?","What if nodes may be missing?","Complexity?"],answer:["Base case returns root if it is null, p, or q.","Recurse left and right.","If both sides found a target, current root is LCA.","If only one side found something, bubble it upward."],complexity:"O(n) time, O(h) space",code:`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,followups:["BST-specific LCA?","What if one node is absent?","Return distance too?"],review:"LCA is where the two target discoveries split across subtrees."},
{id:"LC 433",title:"Minimum Genetic Mutation",difficulty:"Medium",pattern:"Graph",prompt:"Given startGene, endGene, and bank, return the minimum number of single-character mutations needed to reach endGene.",signal:"minimum transformations between strings points to BFS over valid gene states.",hints:["Each valid gene string is a graph node.","Edges connect strings that differ by one character.","BFS gives minimum number of mutations.","Only visit bank genes once."],interviewer:["What are nodes and edges?","Why BFS?","How generate neighbors?","What if endGene is not in bank?"],answer:["Put bank genes in a set.","BFS from startGene with step count.","For each position, try A/C/G/T substitutions.","If generated gene is in bank and unvisited, enqueue it."],complexity:"O(B * L * 4) time, O(B) space",code:`int minMutation(string startGene, string endGene, vector<string>& bank) {
    unordered_set<string> valid(bank.begin(), bank.end());
    if (!valid.count(endGene)) return -1;
    queue<pair<string,int>> q;
    q.push({startGene, 0});
    string letters = "ACGT";
    while (!q.empty()) {
        auto [gene, step] = q.front(); q.pop();
        if (gene == endGene) return step;
        for (int i = 0; i < gene.size(); ++i) {
            string next = gene;
            for (char c : letters) {
                next[i] = c;
                if (valid.erase(next)) q.push({next, step + 1});
            }
        }
    }
    return -1;
}`,followups:["Bidirectional BFS?","Return the path?","Use wildcard buckets?"],review:"Minimum mutation count is shortest path in an implicit graph."},
{id:"LC 127",title:"Word Ladder",difficulty:"Hard",pattern:"Graph",prompt:"Given beginWord, endWord, and wordList, return the length of the shortest transformation sequence.",signal:"shortest word transformation sequence points to BFS over words differing by one character.",hints:["Each word is a graph node.","An edge exists if two words differ by one character.","BFS from beginWord finds the shortest sequence length.","Remove visited words to avoid cycles."],interviewer:["Why BFS?","How generate neighbors?","Can you optimize with wildcard buckets?","What if endWord is absent?"],answer:["Load wordList into a set.","BFS with {word, distance}.","For each position, try replacing with a-z.","If next word exists, erase and enqueue with distance+1."],complexity:"O(N * L * 26) time, O(N) space",code:`int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    queue<pair<string,int>> q;
    q.push({beginWord, 1});
    while (!q.empty()) {
        auto [word, dist] = q.front(); q.pop();
        if (word == endWord) return dist;
        for (int i = 0; i < word.size(); ++i) {
            string next = word;
            for (char c = 'a'; c <= 'z'; ++c) {
                next[i] = c;
                if (words.erase(next)) q.push({next, dist + 1});
            }
        }
    }
    return 0;
}`,followups:["Bidirectional BFS?","Return all shortest paths?","Use pattern buckets?"],review:"Word Ladder is shortest path over an implicit word graph."},
{id:"LC 211",title:"Design Add and Search Words Data Structure",difficulty:"Medium",pattern:"Array / HashMap",secondaryPatterns:["Tree DFS/BFS"],patternReasons:{"Array / HashMap":"Trie nodes store child links by character; fixed alphabet can use arrays.","Tree DFS/BFS":"Wildcard search explores branches in a prefix tree."},prompt:"Design a data structure that supports adding words and searching words where dot can match any letter.",signal:"prefix storage plus wildcard branching points to trie with DFS search.",hints:["Add word like a normal trie insert.","For search, normal letters follow one child.","A dot must try every existing child.","Use DFS over index and trie node."],interviewer:["Why trie instead of hash set?","How handle dot wildcard?","What is search complexity?","Memory tradeoff?"],answer:["Build trie nodes with children and isWord.","Insert creates child nodes.","Search recursively walks characters.","For '.', recursively try all non-null children."],complexity:"Add O(L); search O(26^dots * L) worst case; space O(total characters)",code:`class WordDictionary {
    struct Node {
        array<Node*, 26> child{};
        bool isWord = false;
    };
    Node* root = new Node();
    bool dfs(string& word, int i, Node* node) {
        if (!node) return false;
        if (i == word.size()) return node->isWord;
        if (word[i] == '.') {
            for (Node* child : node->child)
                if (dfs(word, i + 1, child)) return true;
            return false;
        }
        return dfs(word, i + 1, node->child[word[i] - 'a']);
    }
public:
    void addWord(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->child[i]) cur->child[i] = new Node();
            cur = cur->child[i];
        }
        cur->isWord = true;
    }
    bool search(string word) { return dfs(word, 0, root); }
};`,followups:["Support '*' wildcard?","Use hashmap children?","Return matching words?"],review:"Dot wildcard turns trie search into controlled DFS branching."},
{id:"LC 22",title:"Generate Parentheses",difficulty:"Medium",pattern:"Dynamic Programming",secondaryPatterns:["Stack"],patternReasons:{"Dynamic Programming":"The generation can be viewed as building valid states with counts of open and close parentheses.","Stack":"The validity rule is the same stack balance rule: closes can never exceed opens."},prompt:"Given n pairs of parentheses, generate all combinations of well-formed parentheses.",signal:"generate all valid strings with balance constraints points to backtracking over open/close counts.",hints:["You can add '(' while open < n.","You can add ')' only while close < open.","A string is complete when length is 2*n.","Backtracking explores all valid choices."],interviewer:["What makes a prefix valid?","Why can close not exceed open?","How many outputs exist?","Complexity?"],answer:["Backtrack with current string, open count, and close count.","Add '(' if open < n.","Add ')' if close < open.","When length is 2*n, record the string."],complexity:"O(Cn * n) time and space for Catalan number outputs",code:`vector<string> generateParenthesis(int n) {
    vector<string> ans;
    string cur;
    function<void(int,int)> dfs = [&](int open, int close) {
        if (cur.size() == 2 * n) {
            ans.push_back(cur);
            return;
        }
        if (open < n) {
            cur.push_back('(');
            dfs(open + 1, close);
            cur.pop_back();
        }
        if (close < open) {
            cur.push_back(')');
            dfs(open, close + 1);
            cur.pop_back();
        }
    };
    dfs(0, 0);
    return ans;
}`,followups:["Count without generating?","Different bracket types?","Iterative generation?"],review:"Valid-parentheses generation is all prefixes where close count never exceeds open count."},
{id:"LC 133",title:"Clone Graph",difficulty:"Medium",pattern:"Graph",secondaryPatterns:["Array / HashMap"],patternReasons:{"Graph":"The input is a graph, and cloning requires traversing each reachable node and edge.","Array / HashMap":"A hashmap from original node to cloned node prevents duplicate copies and handles cycles."},prompt:"Given a reference node in a connected undirected graph, return a deep copy of the graph.",signal:"graph clone with cycles points to DFS/BFS plus original-to-copy hashmap.",hints:["A graph can revisit the same node through cycles.","Create a map from original node to cloned node.","If a node was cloned before, reuse it.","Clone neighbors recursively or with BFS."],interviewer:["Why need a hashmap?","DFS or BFS?","How handle cycles?","What if node is null?"],answer:["Return null for null input.","If node is already cloned, return the clone.","Create a clone for the current node and store it in the map.","Clone every neighbor and append it to the clone's neighbors."],complexity:"O(V+E) time, O(V) space",code:`Node* cloneGraph(Node* node) {
    unordered_map<Node*, Node*> copy;
    function<Node*(Node*)> dfs = [&](Node* cur) -> Node* {
        if (!cur) return nullptr;
        if (copy.count(cur)) return copy[cur];
        copy[cur] = new Node(cur->val);
        for (Node* nei : cur->neighbors) copy[cur]->neighbors.push_back(dfs(nei));
        return copy[cur];
    };
    return dfs(node);
}`,followups:["Use BFS instead?","Clone a directed graph?","What if graph is disconnected?"],review:"Graph cloning needs traversal plus a map that preserves identity and breaks cycles."}
];
problems.push(...moreLc150Problems);
const lc150CompletionProblems=[
{id:"LC 122",title:"Best Time to Buy and Sell Stock II",difficulty:"Medium",pattern:"Array / HashMap",prompt:"You are given an integer array prices where prices[i] is the price of a given stock on the i^th day.",signal:"Array / String problem: indexing, counts, lookup keys, or direct simulation.",hints:["Identify the lookup key or simulated state.","Use counts/sets/maps when direct lookup removes repeated work.","Preserve index identity if the problem returns positions.","Check duplicates and empty input."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Array / HashMap problem.","Identify the lookup key or simulated state.","Use counts/sets/maps when direct lookup removes repeated work.","Preserve index identity if the problem returns positions."],complexity:"O(n) time, O(n) space unless done in-place",code:`// Study skeleton for 122. Best Time to Buy and Sell Stock II
// Pattern: Array / HashMap
// 1. Identify the lookup key or simulated state.
// 2. Use counts/sets/maps when direct lookup removes repeated work.
// 3. Preserve index identity if the problem returns positions.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Array / String: indexing, counts, lookup keys, or direct simulation."},
{id:"LC 392",title:"Is Subsequence",difficulty:"Easy",pattern:"Two Pointers",prompt:"Given two strings s and t , return true if s is a subsequence of t , or false otherwise .",signal:"Two Pointers problem: two moving boundaries that discard impossible candidates.",hints:["Define what left and right represent.","Use comparisons to decide which side cannot be optimal.","Move only the pointer justified by the invariant.","Confirm the loop terminates and does not skip valid answers."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Two Pointers problem.","Define what left and right represent.","Use comparisons to decide which side cannot be optimal.","Move only the pointer justified by the invariant."],complexity:"O(n) time, O(1) space",code:`// Study skeleton for 392. Is Subsequence
// Pattern: Two Pointers
// 1. Define what left and right represent.
// 2. Use comparisons to decide which side cannot be optimal.
// 3. Move only the pointer justified by the invariant.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Two Pointers: two moving boundaries that discard impossible candidates."},
{id:"LC 30",title:"Substring with Concatenation of All Words",difficulty:"Hard",pattern:"Sliding Window",prompt:"You are given a string s and an array of strings words . All the strings of words are of the same length .",signal:"Sliding Window problem: contiguous window with expandable/shrinkable invariant.",hints:["Define when the window is valid.","Expand right to include new data.","Shrink left only while validity allows it.","Each pointer should move at most n times."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Sliding Window problem.","Define when the window is valid.","Expand right to include new data.","Shrink left only while validity allows it."],complexity:"O(n) time, O(charset or window) space",code:`// Study skeleton for 30. Substring with Concatenation of All Words
// Pattern: Sliding Window
// 1. Define when the window is valid.
// 2. Expand right to include new data.
// 3. Shrink left only while validity allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Sliding Window: contiguous window with expandable/shrinkable invariant."},
{id:"LC 36",title:"Valid Sudoku",difficulty:"Medium",pattern:"Matrix",secondaryPatterns:["Array / HashMap"],prompt:"Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules :",signal:"Matrix problem: grid coordinates / in-place board rules / boundaries.",hints:["Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state.","Use constraints to justify whether extra memory is acceptable."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Matrix problem.","Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state."],complexity:"O(mn) time, O(1) to O(mn) space depending on marking strategy",code:`// Study skeleton for 36. Valid Sudoku
// Pattern: Matrix
// 1. Define the row/column boundaries or neighbor directions first.
// 2. Decide whether the board can be mutated in place.
// 3. Mark visited or transformed cells without losing needed old state.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Matrix: grid coordinates / in-place board rules / boundaries."},
{id:"LC 54",title:"Spiral Matrix",difficulty:"Medium",pattern:"Matrix",secondaryPatterns:["Array / HashMap"],prompt:"Given an m x n matrix , return all elements of the matrix in spiral order .",signal:"Matrix problem: grid coordinates / in-place board rules / boundaries.",hints:["Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state.","Use constraints to justify whether extra memory is acceptable."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Matrix problem.","Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state."],complexity:"O(mn) time, O(1) to O(mn) space depending on marking strategy",code:`// Study skeleton for 54. Spiral Matrix
// Pattern: Matrix
// 1. Define the row/column boundaries or neighbor directions first.
// 2. Decide whether the board can be mutated in place.
// 3. Mark visited or transformed cells without losing needed old state.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Matrix: grid coordinates / in-place board rules / boundaries."},
{id:"LC 48",title:"Rotate Image",difficulty:"Medium",pattern:"Matrix",secondaryPatterns:["Array / HashMap"],prompt:"You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",signal:"Matrix problem: grid coordinates / in-place board rules / boundaries.",hints:["Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state.","Use constraints to justify whether extra memory is acceptable."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Matrix problem.","Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state."],complexity:"O(mn) time, O(1) to O(mn) space depending on marking strategy",code:`// Study skeleton for 48. Rotate Image
// Pattern: Matrix
// 1. Define the row/column boundaries or neighbor directions first.
// 2. Decide whether the board can be mutated in place.
// 3. Mark visited or transformed cells without losing needed old state.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Matrix: grid coordinates / in-place board rules / boundaries."},
{id:"LC 73",title:"Set Matrix Zeroes",difficulty:"Medium",pattern:"Matrix",secondaryPatterns:["Array / HashMap"],prompt:"Given an m x n integer matrix matrix , if an element is 0 , set its entire row and column to 0 's.",signal:"Matrix problem: grid coordinates / in-place board rules / boundaries.",hints:["Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state.","Use constraints to justify whether extra memory is acceptable."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Matrix problem.","Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state."],complexity:"O(mn) time, O(1) to O(mn) space depending on marking strategy",code:`// Study skeleton for 73. Set Matrix Zeroes
// Pattern: Matrix
// 1. Define the row/column boundaries or neighbor directions first.
// 2. Decide whether the board can be mutated in place.
// 3. Mark visited or transformed cells without losing needed old state.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Matrix: grid coordinates / in-place board rules / boundaries."},
{id:"LC 289",title:"Game of Life",difficulty:"Medium",pattern:"Matrix",secondaryPatterns:["Array / HashMap"],prompt:"According to Wikipedia's article : \"The Game of Life , also known simply as Life , is a cellular automaton devised by the British mathematician John Horton Conway in 1970.\"",signal:"Matrix problem: grid coordinates / in-place board rules / boundaries.",hints:["Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state.","Use constraints to justify whether extra memory is acceptable."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Matrix problem.","Define the row/column boundaries or neighbor directions first.","Decide whether the board can be mutated in place.","Mark visited or transformed cells without losing needed old state."],complexity:"O(mn) time, O(1) to O(mn) space depending on marking strategy",code:`// Study skeleton for 289. Game of Life
// Pattern: Matrix
// 1. Define the row/column boundaries or neighbor directions first.
// 2. Decide whether the board can be mutated in place.
// 3. Mark visited or transformed cells without losing needed old state.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Matrix: grid coordinates / in-place board rules / boundaries."},
{id:"LC 224",title:"Basic Calculator",difficulty:"Hard",pattern:"Stack",prompt:"Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation .",signal:"Stack problem: last-in-first-out pending state or expression parsing.",hints:["State what each stack entry represents.","Push pending work or boundaries, pop only when resolved.","For expressions, preserve operand order.","Check empty-stack cases before reading top."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Stack problem.","State what each stack entry represents.","Push pending work or boundaries, pop only when resolved.","For expressions, preserve operand order."],complexity:"O(n) time, O(n) space",code:`// Study skeleton for 224. Basic Calculator
// Pattern: Stack
// 1. State what each stack entry represents.
// 2. Push pending work or boundaries, pop only when resolved.
// 3. For expressions, preserve operand order.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Stack: last-in-first-out pending state or expression parsing."},
{id:"LC 138",title:"Copy List with Random Pointer",difficulty:"Medium",pattern:"Linked List",prompt:"A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null .",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 138. Copy List with Random Pointer
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 92",title:"Reverse Linked List II",difficulty:"Medium",pattern:"Linked List",prompt:"Given the head of a singly linked list and two integers left and right where left \u003c= right , reverse the nodes of the list from position left to position right , and return the reversed list .",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 92. Reverse Linked List II
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 25",title:"Reverse Nodes in k-Group",difficulty:"Hard",pattern:"Linked List",prompt:"Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list .",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 25. Reverse Nodes in k-Group
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 82",title:"Remove Duplicates from Sorted List II",difficulty:"Medium",pattern:"Linked List",prompt:"Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list . Return the linked list sorted as well .",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 82. Remove Duplicates from Sorted List II
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 61",title:"Rotate List",difficulty:"Medium",pattern:"Linked List",prompt:"Given the head of a linked list, rotate the list to the right by k places.",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 61. Rotate List
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 86",title:"Partition List",difficulty:"Medium",pattern:"Linked List",prompt:"Given the head of a linked list and a value x , partition it such that all nodes less than x come before nodes greater than or equal to x .",signal:"Linked List problem: pointer rewiring, dummy node, fast/slow, or split/merge.",hints:["Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links.","Test one-node and two-node cases."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Linked List problem.","Use a dummy node when head may change.","Keep track of the node before the modified segment.","Save next pointers before rewiring links."],complexity:"O(n) time, O(1) extra space unless recursion is used",code:`// Study skeleton for 86. Partition List
// Pattern: Linked List
// 1. Use a dummy node when head may change.
// 2. Keep track of the node before the modified segment.
// 3. Save next pointers before rewiring links.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Linked List: pointer rewiring, dummy node, fast/slow, or split/merge."},
{id:"LC 106",title:"Construct Binary Tree from Inorder and Postorder Traversal",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree .",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 106. Construct Binary Tree from Inorder and Postorder Traversal
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 117",title:"Populating Next Right Pointers in Each Node II",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given a binary tree",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 117. Populating Next Right Pointers in Each Node II
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 114",title:"Flatten Binary Tree to Linked List",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, flatten the tree into a \"linked list\":",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 114. Flatten Binary Tree to Linked List
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 124",title:"Binary Tree Maximum Path Sum",difficulty:"Hard",pattern:"Tree DFS/BFS",prompt:"A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once . Note that the path does not need to pass through the root.",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 124. Binary Tree Maximum Path Sum
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 173",title:"Binary Search Tree Iterator",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST):",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 173. Binary Search Tree Iterator
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 222",title:"Count Complete Tree Nodes",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Given the root of a complete binary tree, return the number of the nodes in the tree.",signal:"Binary Tree General problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 222. Count Complete Tree Nodes
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree General: tree recursion, level order, or path state."},
{id:"LC 637",title:"Average of Levels in Binary Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",prompt:"Solve the problem according to the original LeetCode statement.",signal:"Binary Tree BFS problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 637. Average of Levels in Binary Tree
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree BFS: tree recursion, level order, or path state."},
{id:"LC 103",title:"Binary Tree Zigzag Level Order Traversal",difficulty:"Medium",pattern:"Tree DFS/BFS",prompt:"Given the root of a binary tree, return the zigzag level order traversal of its nodes' values . (i.e., from left to right, then right to left for the next level and alternate between).",signal:"Binary Tree BFS problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 103. Binary Tree Zigzag Level Order Traversal
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Tree BFS: tree recursion, level order, or path state."},
{id:"LC 530",title:"Minimum Absolute Difference in BST",difficulty:"Easy",pattern:"Tree DFS/BFS",secondaryPatterns:["Binary Search"],prompt:"Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree .",signal:"Binary Search Tree problem: tree recursion, level order, or path state.",hints:["Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward.","Check recursion depth or use an iterative queue/stack if needed."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Tree DFS/BFS problem.","Define what each recursive call returns or what each BFS level means.","Handle null/root/leaf cases first.","Decide whether state is carried down or combined upward."],complexity:"O(n) time, O(h) DFS space or O(width) BFS space",code:`// Study skeleton for 530. Minimum Absolute Difference in BST
// Pattern: Tree DFS/BFS
// 1. Define what each recursive call returns or what each BFS level means.
// 2. Handle null/root/leaf cases first.
// 3. Decide whether state is carried down or combined upward.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search Tree: tree recursion, level order, or path state."},
{id:"LC 130",title:"Surrounded Regions",difficulty:"Medium",pattern:"Graph",prompt:"You are given an m x n matrix board containing letters 'X' and 'O' , capture regions that are surrounded :",signal:"Graph General problem: nodes, edges, visited state, and BFS/DFS/topological order.",hints:["Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.","Count each node/edge once for complexity."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Graph problem.","Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering."],complexity:"O(V+E) time, O(V+E) space",code:`// Study skeleton for 130. Surrounded Regions
// Pattern: Graph
// 1. Define nodes and edges explicitly.
// 2. Keep a visited structure to avoid cycles.
// 3. Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Graph General: nodes, edges, visited state, and BFS/DFS/topological order."},
{id:"LC 399",title:"Evaluate Division",difficulty:"Medium",pattern:"Graph",prompt:"You are given an array of variable pairs equations and an array of real numbers values , where equations[i] = [A i , B i ] and values[i] represent the equation A i / B i = values[i] . Each A i or B i is a string that represents a single variable.",signal:"Graph General problem: nodes, edges, visited state, and BFS/DFS/topological order.",hints:["Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.","Count each node/edge once for complexity."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Graph problem.","Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering."],complexity:"O(V+E) time, O(V+E) space",code:`// Study skeleton for 399. Evaluate Division
// Pattern: Graph
// 1. Define nodes and edges explicitly.
// 2. Keep a visited structure to avoid cycles.
// 3. Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Graph General: nodes, edges, visited state, and BFS/DFS/topological order."},
{id:"LC 210",title:"Course Schedule II",difficulty:"Medium",pattern:"Graph",prompt:"There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1 . You are given an array prerequisites where prerequisites[i] = [a i , b i ] indicates that you must take course b i first if you want to take course a i .",signal:"Graph General problem: nodes, edges, visited state, and BFS/DFS/topological order.",hints:["Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.","Count each node/edge once for complexity."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Graph problem.","Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering."],complexity:"O(V+E) time, O(V+E) space",code:`// Study skeleton for 210. Course Schedule II
// Pattern: Graph
// 1. Define nodes and edges explicitly.
// 2. Keep a visited structure to avoid cycles.
// 3. Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Graph General: nodes, edges, visited state, and BFS/DFS/topological order."},
{id:"LC 909",title:"Snakes and Ladders",difficulty:"Medium",pattern:"Graph",secondaryPatterns:["Tree DFS/BFS"],prompt:"You are given an n x n integer matrix board where the cells are labeled from 1 to n^2 in a Boustrophedon style starting from the bottom left of the board (i.e. board[n - 1][0] ) and alternating direction each row.",signal:"Graph BFS problem: nodes, edges, visited state, and BFS/DFS/topological order.",hints:["Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.","Count each node/edge once for complexity."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Graph problem.","Define nodes and edges explicitly.","Keep a visited structure to avoid cycles.","Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering."],complexity:"O(V+E) time, O(V+E) space",code:`// Study skeleton for 909. Snakes and Ladders
// Pattern: Graph
// 1. Define nodes and edges explicitly.
// 2. Keep a visited structure to avoid cycles.
// 3. Use BFS for shortest steps, DFS for reachability/components, or indegree for ordering.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Graph BFS: nodes, edges, visited state, and BFS/DFS/topological order."},
{id:"LC 212",title:"Word Search II",difficulty:"Hard",pattern:"Array / HashMap",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given an m x n board of characters and a list of strings words , return all words on the board .",signal:"Trie problem: indexing, counts, lookup keys, or direct simulation.",hints:["Identify the lookup key or simulated state.","Use counts/sets/maps when direct lookup removes repeated work.","Preserve index identity if the problem returns positions.","Check duplicates and empty input."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Array / HashMap problem.","Identify the lookup key or simulated state.","Use counts/sets/maps when direct lookup removes repeated work.","Preserve index identity if the problem returns positions."],complexity:"O(n) time, O(n) space unless done in-place",code:`// Study skeleton for 212. Word Search II
// Pattern: Array / HashMap
// 1. Identify the lookup key or simulated state.
// 2. Use counts/sets/maps when direct lookup removes repeated work.
// 3. Preserve index identity if the problem returns positions.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Trie: indexing, counts, lookup keys, or direct simulation."},
{id:"LC 17",title:"Letter Combinations of a Phone Number",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order .",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 17. Letter Combinations of a Phone Number
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 77",title:"Combinations",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given two integers n and k , return all possible combinations of k numbers chosen from the range [1, n] .",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 77. Combinations
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 46",title:"Permutations",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given an array nums of distinct integers, return all the possible permutations . You can return the answer in any order .",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 46. Permutations
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 39",title:"Combination Sum",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given an array of distinct integers candidates and a target integer target , return a list of all unique combinations of candidates where the chosen numbers sum to target . You may return the combinations in any order .",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 39. Combination Sum
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 52",title:"N-Queens II",difficulty:"Hard",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 52. N-Queens II
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 79",title:"Word Search",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given an m x n grid of characters board and a string word , return true if word exists in the grid .",signal:"Backtracking problem: generate/search all valid choices with pruning.",hints:["Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing.","Undo the choice before trying the next branch."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Backtracking problem.","Define what one partial candidate means.","List the legal next choices from that state.","Prune invalid choices before recursing."],complexity:"Exponential in the number of choices; space is recursion depth plus output",code:`// Study skeleton for 79. Word Search
// Pattern: Backtracking
// 1. Define what one partial candidate means.
// 2. List the legal next choices from that state.
// 3. Prune invalid choices before recursing.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Backtracking: generate/search all valid choices with pruning."},
{id:"LC 108",title:"Convert Sorted Array to Binary Search Tree",difficulty:"Easy",pattern:"Dynamic Programming",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given an integer array nums where the elements are sorted in ascending order , convert it to a height-balanced binary search tree .",signal:"Divide & Conquer problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 108. Convert Sorted Array to Binary Search Tree
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Divide & Conquer: state transition, base case, and optimal substructure."},
{id:"LC 148",title:"Sort List",difficulty:"Medium",pattern:"Dynamic Programming",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given the head of a linked list, return the list after sorting it in ascending order .",signal:"Divide & Conquer problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 148. Sort List
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Divide & Conquer: state transition, base case, and optimal substructure."},
{id:"LC 427",title:"Construct Quad Tree",difficulty:"Medium",pattern:"Dynamic Programming",secondaryPatterns:["Tree DFS/BFS"],prompt:"Given a n * n matrix grid of 0's and 1's only. We want to represent grid with a Quad-Tree.",signal:"Divide & Conquer problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 427. Construct Quad Tree
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Divide & Conquer: state transition, base case, and optimal substructure."},
{id:"LC 23",title:"Merge k Sorted Lists",difficulty:"Hard",pattern:"Dynamic Programming",secondaryPatterns:["Tree DFS/BFS"],prompt:"You are given an array of k linked-lists lists , each linked-list is sorted in ascending order.",signal:"Divide & Conquer problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 23. Merge k Sorted Lists
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Divide & Conquer: state transition, base case, and optimal substructure."},
{id:"LC 918",title:"Maximum Sum Circular Subarray",difficulty:"Medium",pattern:"Dynamic Programming",secondaryPatterns:["Greedy"],prompt:"Given a circular integer array nums of length n , return the maximum possible sum of a non-empty subarray of nums .",signal:"Kadane's Algorithm problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 918. Maximum Sum Circular Subarray
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Kadane's Algorithm: state transition, base case, and optimal substructure."},
{id:"LC 74",title:"Search a 2D Matrix",difficulty:"Medium",pattern:"Binary Search",prompt:"You are given an m x n integer matrix matrix with the following two properties:",signal:"Binary Search problem: monotonic predicate or sorted search space.",hints:["State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space.","Prove each move discards only impossible values."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Binary Search problem.","State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space."],complexity:"O(log n) time when the predicate is O(1); O(1) space",code:`// Study skeleton for 74. Search a 2D Matrix
// Pattern: Binary Search
// 1. State the monotonic condition.
// 2. Choose inclusive or half-open boundaries and keep them consistent.
// 3. Update the candidate answer when searching answer space.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search: monotonic predicate or sorted search space."},
{id:"LC 162",title:"Find Peak Element",difficulty:"Medium",pattern:"Binary Search",prompt:"A peak element is an element that is strictly greater than its neighbors.",signal:"Binary Search problem: monotonic predicate or sorted search space.",hints:["State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space.","Prove each move discards only impossible values."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Binary Search problem.","State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space."],complexity:"O(log n) time when the predicate is O(1); O(1) space",code:`// Study skeleton for 162. Find Peak Element
// Pattern: Binary Search
// 1. State the monotonic condition.
// 2. Choose inclusive or half-open boundaries and keep them consistent.
// 3. Update the candidate answer when searching answer space.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search: monotonic predicate or sorted search space."},
{id:"LC 34",title:"Find First and Last Position of Element in Sorted Array",difficulty:"Medium",pattern:"Binary Search",prompt:"Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.",signal:"Binary Search problem: monotonic predicate or sorted search space.",hints:["State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space.","Prove each move discards only impossible values."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Binary Search problem.","State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space."],complexity:"O(log n) time when the predicate is O(1); O(1) space",code:`// Study skeleton for 34. Find First and Last Position of Element in Sorted Array
// Pattern: Binary Search
// 1. State the monotonic condition.
// 2. Choose inclusive or half-open boundaries and keep them consistent.
// 3. Update the candidate answer when searching answer space.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search: monotonic predicate or sorted search space."},
{id:"LC 153",title:"Find Minimum in Rotated Sorted Array",difficulty:"Medium",pattern:"Binary Search",prompt:"Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:",signal:"Binary Search problem: monotonic predicate or sorted search space.",hints:["State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space.","Prove each move discards only impossible values."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Binary Search problem.","State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space."],complexity:"O(log n) time when the predicate is O(1); O(1) space",code:`// Study skeleton for 153. Find Minimum in Rotated Sorted Array
// Pattern: Binary Search
// 1. State the monotonic condition.
// 2. Choose inclusive or half-open boundaries and keep them consistent.
// 3. Update the candidate answer when searching answer space.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search: monotonic predicate or sorted search space."},
{id:"LC 4",title:"Median of Two Sorted Arrays",difficulty:"Hard",pattern:"Binary Search",prompt:"Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",signal:"Binary Search problem: monotonic predicate or sorted search space.",hints:["State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space.","Prove each move discards only impossible values."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Binary Search problem.","State the monotonic condition.","Choose inclusive or half-open boundaries and keep them consistent.","Update the candidate answer when searching answer space."],complexity:"O(log n) time when the predicate is O(1); O(1) space",code:`// Study skeleton for 4. Median of Two Sorted Arrays
// Pattern: Binary Search
// 1. State the monotonic condition.
// 2. Choose inclusive or half-open boundaries and keep them consistent.
// 3. Update the candidate answer when searching answer space.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Binary Search: monotonic predicate or sorted search space."},
{id:"LC 502",title:"IPO",difficulty:"Hard",pattern:"Heap",prompt:"Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO . Since it has limited resources, it can only finish at most k distinct projects before the IPO . Help LeetCode design the best way to maximize its total capital after finishing at most k distinct projects.",signal:"Heap problem: repeated best candidate, top k, or two balanced frontiers.",hints:["Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k.","Remember heap is a selection tool, not the whole idea."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Heap problem.","Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k."],complexity:"O(n log k) or O(n log n) time, O(k) to O(n) space",code:`// Study skeleton for 502. IPO
// Pattern: Heap
// 1. Define the ranking key for the heap.
// 2. Decide whether you need min-heap, max-heap, or two heaps.
// 3. Keep heap size bounded when solving top-k.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Heap: repeated best candidate, top k, or two balanced frontiers."},
{id:"LC 373",title:"Find K Pairs with Smallest Sums",difficulty:"Medium",pattern:"Heap",prompt:"You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k .",signal:"Heap problem: repeated best candidate, top k, or two balanced frontiers.",hints:["Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k.","Remember heap is a selection tool, not the whole idea."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Heap problem.","Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k."],complexity:"O(n log k) or O(n log n) time, O(k) to O(n) space",code:`// Study skeleton for 373. Find K Pairs with Smallest Sums
// Pattern: Heap
// 1. Define the ranking key for the heap.
// 2. Decide whether you need min-heap, max-heap, or two heaps.
// 3. Keep heap size bounded when solving top-k.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Heap: repeated best candidate, top k, or two balanced frontiers."},
{id:"LC 295",title:"Find Median from Data Stream",difficulty:"Hard",pattern:"Heap",prompt:"The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.",signal:"Heap problem: repeated best candidate, top k, or two balanced frontiers.",hints:["Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k.","Remember heap is a selection tool, not the whole idea."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Heap problem.","Define the ranking key for the heap.","Decide whether you need min-heap, max-heap, or two heaps.","Keep heap size bounded when solving top-k."],complexity:"O(n log k) or O(n log n) time, O(k) to O(n) space",code:`// Study skeleton for 295. Find Median from Data Stream
// Pattern: Heap
// 1. Define the ranking key for the heap.
// 2. Decide whether you need min-heap, max-heap, or two heaps.
// 3. Keep heap size bounded when solving top-k.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Heap: repeated best candidate, top k, or two balanced frontiers."},
{id:"LC 67",title:"Add Binary",difficulty:"Easy",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Given two binary strings a and b , return their sum as a binary string .",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 67. Add Binary
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 190",title:"Reverse Bits",difficulty:"Easy",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Reverse bits of a given 32 bits signed integer.",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 190. Reverse Bits
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 191",title:"Number of 1 Bits",difficulty:"Easy",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Given a positive integer n , write a function that returns the number of set bits in its binary representation (also known as the Hamming weight ).",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 191. Number of 1 Bits
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 136",title:"Single Number",difficulty:"Easy",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Given a non-empty array of integers nums , every element appears twice except for one. Find that single one.",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 136. Single Number
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 137",title:"Single Number II",difficulty:"Medium",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Given an integer array nums where every element appears three times except for one, which appears exactly once . Find the single element and return it .",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 137. Single Number II
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 201",title:"Bitwise AND of Numbers Range",difficulty:"Medium",pattern:"Bit Manipulation",secondaryPatterns:["Math"],prompt:"Given two integers left and right that represent the range [left, right] , return the bitwise AND of all numbers in this range, inclusive .",signal:"Bit Manipulation problem: bit state, xor, masks, shifts, or common prefix bits.",hints:["Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it.","Check signed/unsigned and 32-bit boundary behavior."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Bit Manipulation problem.","Name what each bit represents.","Look for xor cancellation, masks, shifts, or shared prefixes.","Avoid converting to strings unless the problem allows it."],complexity:"O(1) to O(n) time depending on input size, O(1) space",code:`// Study skeleton for 201. Bitwise AND of Numbers Range
// Pattern: Bit Manipulation
// 1. Name what each bit represents.
// 2. Look for xor cancellation, masks, shifts, or shared prefixes.
// 3. Avoid converting to strings unless the problem allows it.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Bit Manipulation: bit state, xor, masks, shifts, or common prefix bits."},
{id:"LC 9",title:"Palindrome Number",difficulty:"Easy",pattern:"Math",secondaryPatterns:["Array / HashMap"],prompt:"Given an integer x , return true if x is a palindrome , and false otherwise .",signal:"Math problem: numeric invariant, formula, gcd/slope, or fast exponentiation.",hints:["State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling.","Use small examples to verify the formula."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Math problem.","State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling."],complexity:"O(log n) or O(n^2) depending on enumeration; usually O(1) extra space",code:`// Study skeleton for 9. Palindrome Number
// Pattern: Math
// 1. State the numeric invariant before coding.
// 2. Reduce repeated multiplication/counting with a formula or logarithmic loop.
// 3. Watch overflow and sign handling.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Math: numeric invariant, formula, gcd/slope, or fast exponentiation."},
{id:"LC 172",title:"Factorial Trailing Zeroes",difficulty:"Medium",pattern:"Math",secondaryPatterns:["Array / HashMap"],prompt:"Given an integer n , return the number of trailing zeroes in n! .",signal:"Math problem: numeric invariant, formula, gcd/slope, or fast exponentiation.",hints:["State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling.","Use small examples to verify the formula."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Math problem.","State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling."],complexity:"O(log n) or O(n^2) depending on enumeration; usually O(1) extra space",code:`// Study skeleton for 172. Factorial Trailing Zeroes
// Pattern: Math
// 1. State the numeric invariant before coding.
// 2. Reduce repeated multiplication/counting with a formula or logarithmic loop.
// 3. Watch overflow and sign handling.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Math: numeric invariant, formula, gcd/slope, or fast exponentiation."},
{id:"LC 50",title:"Pow(x, n)",difficulty:"Medium",pattern:"Math",secondaryPatterns:["Array / HashMap"],prompt:"Implement pow(x, n) , which calculates x raised to the power n (i.e., x^n ).",signal:"Math problem: numeric invariant, formula, gcd/slope, or fast exponentiation.",hints:["State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling.","Use small examples to verify the formula."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Math problem.","State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling."],complexity:"O(log n) or O(n^2) depending on enumeration; usually O(1) extra space",code:`// Study skeleton for 50. Pow(x, n)
// Pattern: Math
// 1. State the numeric invariant before coding.
// 2. Reduce repeated multiplication/counting with a formula or logarithmic loop.
// 3. Watch overflow and sign handling.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Math: numeric invariant, formula, gcd/slope, or fast exponentiation."},
{id:"LC 149",title:"Max Points on a Line",difficulty:"Hard",pattern:"Math",secondaryPatterns:["Array / HashMap"],prompt:"Given an array of points where points[i] = [x i , y i ] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line .",signal:"Math problem: numeric invariant, formula, gcd/slope, or fast exponentiation.",hints:["State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling.","Use small examples to verify the formula."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Math problem.","State the numeric invariant before coding.","Reduce repeated multiplication/counting with a formula or logarithmic loop.","Watch overflow and sign handling."],complexity:"O(log n) or O(n^2) depending on enumeration; usually O(1) extra space",code:`// Study skeleton for 149. Max Points on a Line
// Pattern: Math
// 1. State the numeric invariant before coding.
// 2. Reduce repeated multiplication/counting with a formula or logarithmic loop.
// 3. Watch overflow and sign handling.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Math: numeric invariant, formula, gcd/slope, or fast exponentiation."},
{id:"LC 70",title:"Climbing Stairs",difficulty:"Easy",pattern:"Dynamic Programming",prompt:"You are climbing a staircase. It takes n steps to reach the top.",signal:"1D DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 70. Climbing Stairs
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"1D DP: state transition, base case, and optimal substructure."},
{id:"LC 198",title:"House Robber",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night .",signal:"1D DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 198. House Robber
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"1D DP: state transition, base case, and optimal substructure."},
{id:"LC 139",title:"Word Break",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given a string s and a dictionary of strings wordDict , return true if s can be segmented into a space-separated sequence of one or more dictionary words.",signal:"1D DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 139. Word Break
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"1D DP: state transition, base case, and optimal substructure."},
{id:"LC 322",title:"Coin Change",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",signal:"1D DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 322. Coin Change
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"1D DP: state transition, base case, and optimal substructure."},
{id:"LC 300",title:"Longest Increasing Subsequence",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given an integer array nums , return the length of the longest strictly increasing subsequence .",signal:"1D DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 300. Longest Increasing Subsequence
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"1D DP: state transition, base case, and optimal substructure."},
{id:"LC 120",title:"Triangle",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given a triangle array, return the minimum path sum from top to bottom .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 120. Triangle
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 64",title:"Minimum Path Sum",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.",signal:"Grid + minimum cost path + only right/down moves -> DP where each cell keeps the best cost to reach it.",hints:["Define dp[i][j] as the minimum path sum from (0,0) to (i,j).","Only two previous cells can enter (i,j): top and left.","First row can only come from the left; first column can only come from above.","You may update grid in-place because each cell only needs already-computed top/left values."],interviewer:["What is the DP state?","Why is the transition only from top or left?","Can we reduce extra space?","What edge cases should we test?"],answer:["Let grid[i][j] become the minimum cost to reach that cell.","Initialize the first column by accumulating from above.","Initialize the first row by accumulating from the left.","For every other cell, add min(grid[i-1][j], grid[i][j-1]).","Return grid[m-1][n-1]."],complexity:"O(mn) time, O(1) extra space",code:`int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size();
    int n = grid[0].size();

    for (int i = 1; i < m; ++i) {
        grid[i][0] += grid[i - 1][0];
    }

    for (int j = 1; j < n; ++j) {
        grid[0][j] += grid[0][j - 1];
    }

    for (int i = 1; i < m; ++i) {
        for (int j = 1; j < n; ++j) {
            grid[i][j] += min(grid[i - 1][j], grid[i][j - 1]);
        }
    }

    return grid[m - 1][n - 1];
}`,followups:["What if grid cannot be mutated?","What if diagonal moves are allowed?","What if there are obstacles?"],review:"Minimum path sum is grid DP: best cost at each cell equals cell value plus min(top, left)."},
{id:"LC 63",title:"Unique Paths II",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"You are given an m x n integer array grid . There is a robot initially located at the top-left corner (i.e., grid[0][0] ). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1] ). The robot can only move either down or right at any point in time.",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 63. Unique Paths II
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 5",title:"Longest Palindromic Substring",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given a string s , return the longest palindromic substring in s .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 5. Longest Palindromic Substring
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 97",title:"Interleaving String",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given strings s1 , s2 , and s3 , find whether s3 is formed by an interleaving of s1 and s2 .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 97. Interleaving String
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 72",title:"Edit Distance",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given two strings word1 and word2 , return the minimum number of operations required to convert word1 to word2 .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 72. Edit Distance
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 123",title:"Best Time to Buy and Sell Stock III",difficulty:"Hard",pattern:"Dynamic Programming",prompt:"You are given an array prices where prices[i] is the price of a given stock on the i^th day.",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 123. Best Time to Buy and Sell Stock III
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 188",title:"Best Time to Buy and Sell Stock IV",difficulty:"Hard",pattern:"Dynamic Programming",prompt:"You are given an integer array prices where prices[i] is the price of a given stock on the i^th day, and an integer k .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 188. Best Time to Buy and Sell Stock IV
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."},
{id:"LC 221",title:"Maximal Square",difficulty:"Medium",pattern:"Dynamic Programming",prompt:"Given an m x n binary matrix filled with 0 's and 1 's, find the largest square containing only 1 's and return its area .",signal:"Multidimensional DP problem: state transition, base case, and optimal substructure.",hints:["Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean.","Compress space only after the full state is clear."],interviewer:["What is the key invariant?","What edge cases should we clarify?","Why does this pattern fit?","What is the time and space complexity?"],answer:["Model this as a Dynamic Programming problem.","Define the state in one sentence.","Write the base case before the transition.","Identify whether the answer is max, min, count, or boolean."],complexity:"O(states * transitions) time, O(states) space",code:`// Study skeleton for 221. Maximal Square
// Pattern: Dynamic Programming
// 1. Define the state in one sentence.
// 2. Write the base case before the transition.
// 3. Identify whether the answer is max, min, count, or boolean.
// Fill in the LeetCode function signature, then preserve the invariant above.`,followups:["Can we reduce memory?","What changes if input is very large?","How would you explain correctness?"],review:"Multidimensional DP: state transition, base case, and optimal substructure."}
];
problems.push(...lc150CompletionProblems);

const patternOverlapUpdates={
"LC 11":{secondaryPatterns:["Greedy"],patternReasons:{"Two Pointers":"The implementation is two pointers because it keeps one index at each end and moves one boundary per step.","Greedy":"The proof is greedy because every step discards the shorter side: keeping it while shrinking width cannot produce a better area."}},
"LC 53":{secondaryPatterns:["Greedy"],patternReasons:{"Dynamic Programming":"Kadane's state is DP: max subarray sum ending at the current index.","Greedy":"The transition also has a greedy interpretation: at each index, keep the previous sum only if it helps."}},
"LC 121":{secondaryPatterns:["Dynamic Programming"],patternReasons:{"Greedy":"The one-pass solution greedily keeps the lowest buy price seen so far.","Dynamic Programming":"It can also be framed as DP over holding/not-holding states, simplified to two variables."}},
"LC 146":{secondaryPatterns:["Linked List","Array / HashMap"],patternReasons:{"HashMap / Prefix":"The current dataset label points to O(1) key lookup, though this is not a prefix problem.","Linked List":"The recency order is maintained by a doubly linked list.","Array / HashMap":"The essential lookup structure is a hashmap from key to node."}},
"LC 200":{secondaryPatterns:["Tree DFS/BFS"],patternReasons:{"Graph":"The grid is an implicit graph and islands are connected components.","Tree DFS/BFS":"The implementation is usually DFS or BFS flood fill, even though the structure is a graph rather than a tree."}},
"LC 202":{secondaryPatterns:["Array / HashMap"],patternReasons:{"Linked List":"Floyd cycle detection treats repeated values like a linked-list cycle.","Array / HashMap":"A seen-set solution is also valid and often easier to explain first."}},
"LC 215":{secondaryPatterns:["Array / HashMap"],patternReasons:{"Heap":"The interview-friendly solution keeps a min-heap of size k.","Array / HashMap":"Quickselect is an array partitioning alternative; it is not a heap, but it is a valid top-k strategy."}},
"LC 347":{secondaryPatterns:["Array / HashMap"],patternReasons:{"Heap":"The selection step uses a heap to keep the top k frequencies.","Array / HashMap":"The first required step is a frequency hashmap; bucket sort is also array-based."}},
"LC 45":{secondaryPatterns:["Graph"],patternReasons:{"Greedy":"The optimal O(n) solution greedily expands the farthest reachable range.","Graph":"The range view is BFS by levels on an implicit jump graph."}},
"LC 189":{secondaryPatterns:["Two Pointers"],patternReasons:{"Array / HashMap":"The problem is an array transformation and can be solved with extra array storage.","Two Pointers":"The in-place reverse solution uses two-pointer reversal as the core operation."}},
"LC 42":{secondaryPatterns:["Stack","HashMap / Prefix"],patternReasons:{"Two Pointers":"The O(1) space solution uses left/right pointers and side maxima.","Stack":"A monotonic stack solution is a standard valid approach.","HashMap / Prefix":"Prefix/suffix max arrays are another standard way to compute each bar's water level."}}
};
problems.forEach(q=>{const overlap=patternOverlapUpdates[q.id];if(!overlap)return;q.secondaryPatterns=[...new Set([...(q.secondaryPatterns||[]),...(overlap.secondaryPatterns||[])])];q.patternReasons={...(q.patternReasons||{}),...(overlap.patternReasons||{})};});
const alternativeSolutions={
"LC 1":{title:"Alternative：排序 + Two Pointers（保留原 index）",note:"如果面試官追問 sorted input 或 memory tradeoff，可以用這版說明。時間 O(n log n)，空間 O(n)。",code:`vector<int> twoSum(vector<int>& nums, int target) {
    vector<pair<int,int>> arr;
    for (int i = 0; i < nums.size(); ++i) arr.push_back({nums[i], i});
    sort(arr.begin(), arr.end());
    int l = 0, r = arr.size() - 1;
    while (l < r) {
        int sum = arr[l].first + arr[r].first;
        if (sum == target) return {arr[l].second, arr[r].second};
        if (sum < target) ++l;
        else --r;
    }
    return {};
}`},
"LC 3":{title:"Alternative：HashSet Window",note:"概念更直觀：window 內維持沒有重複字元。時間 O(n)，空間 O(charset)。",code:`int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0, ans = 0;
    for (int right = 0; right < s.size(); ++right) {
        while (window.count(s[right])) {
            window.erase(s[left]);
            ++left;
        }
        window.insert(s[right]);
        ans = max(ans, right - left + 1);
    }
    return ans;
}`},
"LC 11":{title:"Alternative：Brute Force Baseline",note:"這版不是最佳解，但用來對照 two pointers 為什麼必要。時間 O(n^2)，空間 O(1)。",code:`int maxArea(vector<int>& height) {
    int ans = 0;
    for (int i = 0; i < height.size(); ++i) {
        for (int j = i + 1; j < height.size(); ++j) {
            ans = max(ans, (j - i) * min(height[i], height[j]));
        }
    }
    return ans;
}`},
"LC 15":{title:"Alternative：Brute Force + Set 去重",note:"可當 baseline，幫你說清楚最佳解為什麼要排序與 two pointers。時間 O(n^3 log n)。",code:`vector<vector<int>> threeSum(vector<int>& nums) {
    set<vector<int>> seen;
    int n = nums.size();
    for (int i = 0; i < n; ++i)
        for (int j = i + 1; j < n; ++j)
            for (int k = j + 1; k < n; ++k)
                if (nums[i] + nums[j] + nums[k] == 0) {
                    vector<int> triplet = {nums[i], nums[j], nums[k]};
                    sort(triplet.begin(), triplet.end());
                    seen.insert(triplet);
                }
    return vector<vector<int>>(seen.begin(), seen.end());
}`},
"LC 20":{title:"Alternative：Push Open Brackets",note:"另一種常見寫法：stack 存左括號，再用 map 比對右括號。時間 O(n)。",code:`bool isValid(string s) {
    unordered_map<char,char> match = {{')','('}, {']','['}, {'}','{'}};
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty() || st.top() != match[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`},
"LC 33":{title:"Alternative：先找 pivot，再做普通 Binary Search",note:"拆成兩個熟悉步驟，較好 debug。時間 O(log n)，空間 O(1)。",code:`int search(vector<int>& nums, int target) {
    int n = nums.size(), l = 0, r = n - 1;
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] > nums[r]) l = m + 1;
        else r = m;
    }
    int pivot = l;
    l = 0; r = n - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        int real = (m + pivot) % n;
        if (nums[real] == target) return real;
        if (nums[real] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`},
"LC 49":{title:"Alternative：26-count Frequency Key",note:"避免每個字串排序，適合 lowercase English。時間 O(n*k)，空間 O(n*k)。",code:`vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (string& s : strs) {
        vector<int> cnt(26, 0);
        for (char c : s) cnt[c - 'a']++;
        string key;
        for (int x : cnt) key += "#" + to_string(x);
        groups[key].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto& [key, vals] : groups) ans.push_back(move(vals));
    return ans;
}`},
"LC 53":{title:"Alternative：Prefix Sum + Minimum Prefix",note:"把最大子陣列寫成 prefix[j] - minPrefixBeforeJ。時間 O(n)，空間 O(1)。",code:`int maxSubArray(vector<int>& nums) {
    int prefix = 0, minPrefix = 0, best = nums[0];
    for (int x : nums) {
        prefix += x;
        best = max(best, prefix - minPrefix);
        minPrefix = min(minPrefix, prefix);
    }
    return best;
}`},
"LC 76":{title:"Alternative：Array Counts for ASCII",note:"如果 character set 可控，array 比 unordered_map 更快也更簡潔。時間 O(n+m)。",code:`string minWindow(string s, string t) {
    vector<int> need(128, 0);
    for (char c : t) need[c]++;
    int missing = t.size(), left = 0, bestL = 0, bestLen = INT_MAX;
    for (int right = 0; right < s.size(); ++right) {
        if (need[s[right]]-- > 0) missing--;
        while (missing == 0) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestL = left;
            }
            if (++need[s[left++]] > 0) missing++;
        }
    }
    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}`},
"LC 98":{title:"Alternative：Inorder Traversal",note:"BST inorder 會嚴格遞增。時間 O(n)，空間 O(h)。",code:`bool isValidBST(TreeNode* root) {
    long prev = LONG_MIN;
    bool hasPrev = false;
    function<bool(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node) return true;
        if (!inorder(node->left)) return false;
        if (hasPrev && node->val <= prev) return false;
        hasPrev = true;
        prev = node->val;
        return inorder(node->right);
    };
    return inorder(root);
}`},
"LC 102":{title:"Alternative：DFS with Depth",note:"不用 queue，也能依照 depth 把節點放進對應層。時間 O(n)，空間 O(h)。",code:`vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int depth) {
        if (!node) return;
        if (depth == ans.size()) ans.push_back({});
        ans[depth].push_back(node->val);
        dfs(node->left, depth + 1);
        dfs(node->right, depth + 1);
    };
    dfs(root, 0);
    return ans;
}`},
"LC 128":{title:"Alternative：Sorting",note:"較直觀但不是題目要求的 O(n)。可用來對照 HashSet 解法。時間 O(n log n)。",code:`int longestConsecutive(vector<int>& nums) {
    if (nums.empty()) return 0;
    sort(nums.begin(), nums.end());
    int best = 1, cur = 1;
    for (int i = 1; i < nums.size(); ++i) {
        if (nums[i] == nums[i - 1]) continue;
        if (nums[i] == nums[i - 1] + 1) cur++;
        else cur = 1;
        best = max(best, cur);
    }
    return best;
}`},
"LC 146":{title:"Alternative：Manual Doubly Linked List",note:"不用 STL list，面試官要你手刻資料結構時可用這版。get/put 都是 O(1)。",code:`class LRUCache {
    struct Node { int key, val; Node *prev, *next; };
    int cap;
    unordered_map<int, Node*> mp;
    Node *head, *tail;
    void remove(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    void addFront(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }
public:
    LRUCache(int capacity) : cap(capacity) {
        head = new Node{0,0,nullptr,nullptr};
        tail = new Node{0,0,nullptr,nullptr};
        head->next = tail;
        tail->prev = head;
    }
    int get(int key) {
        if (!mp.count(key)) return -1;
        Node* node = mp[key];
        remove(node);
        addFront(node);
        return node->val;
    }
    void put(int key, int value) {
        if (mp.count(key)) {
            Node* node = mp[key];
            node->val = value;
            remove(node);
            addFront(node);
            return;
        }
        if (mp.size() == cap) {
            Node* old = tail->prev;
            remove(old);
            mp.erase(old->key);
            delete old;
        }
        Node* node = new Node{key, value, nullptr, nullptr};
        mp[key] = node;
        addFront(node);
    }
};`},
"LC 200":{title:"Alternative：BFS Flood Fill",note:"避免遞迴深度風險。時間 O(mn)，空間 O(mn)。",code:`int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), ans = 0;
    vector<pair<int,int>> dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (grid[r][c] != '1') continue;
            ans++;
            queue<pair<int,int>> q;
            q.push({r, c});
            grid[r][c] = '0';
            while (!q.empty()) {
                auto [x, y] = q.front(); q.pop();
                for (auto [dx, dy] : dirs) {
                    int nx = x + dx, ny = y + dy;
                    if (nx < 0 || nx >= m || ny < 0 || ny >= n || grid[nx][ny] != '1') continue;
                    grid[nx][ny] = '0';
                    q.push({nx, ny});
                }
            }
        }
    }
    return ans;
}`},
"LC 207":{title:"Alternative：DFS Color Cycle Detection",note:"0=unvisited, 1=visiting, 2=done。遇到 visiting 代表有環。時間 O(V+E)。",code:`bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    for (auto& p : prerequisites) graph[p[1]].push_back(p[0]);
    vector<int> color(numCourses, 0);
    function<bool(int)> dfs = [&](int u) {
        if (color[u] == 1) return false;
        if (color[u] == 2) return true;
        color[u] = 1;
        for (int v : graph[u]) if (!dfs(v)) return false;
        color[u] = 2;
        return true;
    };
    for (int i = 0; i < numCourses; ++i)
        if (!dfs(i)) return false;
    return true;
}`},
"LC 215":{title:"Alternative：Quickselect",note:"平均 O(n)，但 worst-case O(n^2)。適合追問更佳平均時間時講。",code:`int findKthLargest(vector<int>& nums, int k) {
    int target = nums.size() - k;
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int pivot = nums[r], p = l;
        for (int i = l; i < r; ++i) {
            if (nums[i] <= pivot) swap(nums[i], nums[p++]);
        }
        swap(nums[p], nums[r]);
        if (p == target) return nums[p];
        if (p < target) l = p + 1;
        else r = p - 1;
    }
    return -1;
}`},
"LC 238":{title:"Alternative：Explicit Prefix and Suffix Arrays",note:"概念最清楚，空間 O(n)，再優化成主解的 O(1) extra space。",code:`vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> prefix(n, 1), suffix(n, 1), ans(n);
    for (int i = 1; i < n; ++i) prefix[i] = prefix[i - 1] * nums[i - 1];
    for (int i = n - 2; i >= 0; --i) suffix[i] = suffix[i + 1] * nums[i + 1];
    for (int i = 0; i < n; ++i) ans[i] = prefix[i] * suffix[i];
    return ans;
}`},
"LC 121":{title:"Alternative: DP State",note:"Same logic as greedy, written as hold/sold states. Time O(n), space O(1).",code:`int maxProfit(vector<int>& prices) {
    int hold = -prices[0], sold = 0;
    for (int i = 1; i < prices.size(); ++i) {
        sold = max(sold, hold + prices[i]);
        hold = max(hold, -prices[i]);
    }
    return sold;
}`},
"LC 125":{title:"Alternative: Build Cleaned String",note:"Simpler to reason about, but uses O(n) extra space.",code:`bool isPalindrome(string s) {
    string t;
    for (char c : s) if (isalnum(c)) t.push_back(tolower(c));
    string rev = t;
    reverse(rev.begin(), rev.end());
    return t == rev;
}`},
"LC 217":{title:"Alternative: Sorting",note:"Uses O(1) extra space if sorting in-place is allowed, but time is O(n log n).",code:`bool containsDuplicate(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (int i = 1; i < nums.size(); ++i)
        if (nums[i] == nums[i - 1]) return true;
    return false;
}`},
"LC 242":{title:"Alternative: Sorting",note:"Short and general, but O(n log n).",code:`bool isAnagram(string s, string t) {
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    return s == t;
}`},
"LC 226":{title:"Alternative: Iterative BFS",note:"Avoids recursion and makes mutation explicit. Time O(n), space O(width).",code:`TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        swap(node->left, node->right);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return root;
}`},
"LC 347":{title:"Alternative: Bucket Sort",note:"Frequency is at most n, so buckets can produce O(n) time.",code:`vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [x, f] : freq) buckets[f].push_back(x);
    vector<int> ans;
    for (int f = buckets.size() - 1; f >= 0 && ans.size() < k; --f)
        for (int x : buckets[f]) {
            ans.push_back(x);
            if (ans.size() == k) break;
        }
    return ans;
}`}
};
Object.assign(alternativeSolutions,{
"LC 88":{title:"Alternative: Extra Array Merge",note:"Simpler and useful as a baseline, but uses O(m+n) extra space.",code:`void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    vector<int> merged;
    int i = 0, j = 0;
    while (i < m || j < n) {
        if (j == n || (i < m && nums1[i] <= nums2[j])) merged.push_back(nums1[i++]);
        else merged.push_back(nums2[j++]);
    }
    nums1 = merged;
}`},
"LC 27":{title:"Alternative: Swap With End",note:"Good when order does not matter and val is rare; still O(n) time.",code:`int removeElement(vector<int>& nums, int val) {
    int i = 0, n = nums.size();
    while (i < n) {
        if (nums[i] == val) nums[i] = nums[--n];
        else ++i;
    }
    return n;
}`},
"LC 26":{title:"Alternative: STL unique",note:"Concise if library use is allowed; same write-pointer idea internally.",code:`int removeDuplicates(vector<int>& nums) {
    return unique(nums.begin(), nums.end()) - nums.begin();
}`},
"LC 80":{title:"Alternative: General At-Most-K Helper",note:"Shows the reusable form for allowing up to k duplicates.",code:`int removeDuplicatesAtMostK(vector<int>& nums, int limit) {
    int k = 0;
    for (int x : nums)
        if (k < limit || x != nums[k - limit]) nums[k++] = x;
    return k;
}

int removeDuplicates(vector<int>& nums) {
    return removeDuplicatesAtMostK(nums, 2);
}`},
"LC 169":{title:"Alternative: HashMap Count",note:"Straightforward baseline. Time O(n), space O(n).",code:`int majorityElement(vector<int>& nums) {
    unordered_map<int,int> count;
    for (int x : nums) {
        if (++count[x] > nums.size() / 2) return x;
    }
    return nums[0];
}`},
"LC 189":{title:"Alternative: Extra Array",note:"Very clear mapping formula, but uses O(n) extra space.",code:`void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> ans(n);
    for (int i = 0; i < n; ++i) ans[(i + k) % n] = nums[i];
    nums = ans;
}`},
"LC 55":{title:"Alternative: Work Backward",note:"Track the leftmost position that can reach the goal.",code:`bool canJump(vector<int>& nums) {
    int goal = nums.size() - 1;
    for (int i = nums.size() - 2; i >= 0; --i)
        if (i + nums[i] >= goal) goal = i;
    return goal == 0;
}`},
"LC 45":{title:"Alternative: DP Baseline",note:"Clear but slower. Useful for explaining why greedy layers are better.",code:`int jump(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, INT_MAX / 2);
    dp[0] = 0;
    for (int i = 0; i < n; ++i)
        for (int j = 1; j <= nums[i] && i + j < n; ++j)
            dp[i + j] = min(dp[i + j], dp[i] + 1);
    return dp[n - 1];
}`},
"LC 274":{title:"Alternative: Sorting",note:"Sort citations, then find the first position satisfying citations[i] >= n-i.",code:`int hIndex(vector<int>& citations) {
    sort(citations.begin(), citations.end());
    int n = citations.size();
    for (int i = 0; i < n; ++i)
        if (citations[i] >= n - i) return n - i;
    return 0;
}`},
"LC 380":{title:"Alternative: Set Baseline",note:"Shows why a set alone cannot support uniform O(1) getRandom by index.",code:`class RandomizedSet {
    unordered_set<int> s;
public:
    bool insert(int val) { return s.insert(val).second; }
    bool remove(int val) { return s.erase(val) > 0; }
    int getRandom() {
        int pick = rand() % s.size();
        auto it = s.begin();
        while (pick--) ++it;
        return *it;
    }
};`},
"LC 134":{title:"Alternative: Brute Force Simulation",note:"Correct but O(n^2); useful to motivate greedy restart.",code:`int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int n = gas.size();
    for (int start = 0; start < n; ++start) {
        int tank = 0, steps = 0;
        while (steps < n) {
            int i = (start + steps) % n;
            tank += gas[i] - cost[i];
            if (tank < 0) break;
            ++steps;
        }
        if (steps == n) return start;
    }
    return -1;
}`},
"LC 42":{title:"Alternative: Prefix and Suffix Max",note:"Conceptually direct, but uses O(n) extra space.",code:`int trap(vector<int>& height) {
    int n = height.size();
    vector<int> left(n), right(n);
    for (int i = 0; i < n; ++i) left[i] = i ? max(left[i - 1], height[i]) : height[i];
    for (int i = n - 1; i >= 0; --i) right[i] = i + 1 < n ? max(right[i + 1], height[i]) : height[i];
    int ans = 0;
    for (int i = 0; i < n; ++i) ans += min(left[i], right[i]) - height[i];
    return ans;
}`},
"LC 13":{title:"Alternative: Right-to-Left Scan",note:"Keep the largest symbol seen to decide add vs subtract.",code:`int romanToInt(string s) {
    unordered_map<char,int> val{{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int ans = 0, maxSeen = 0;
    for (int i = s.size() - 1; i >= 0; --i) {
        int cur = val[s[i]];
        if (cur < maxSeen) ans -= cur;
        else { ans += cur; maxSeen = cur; }
    }
    return ans;
}`},
"LC 12":{title:"Alternative: Digit Tables",note:"Uses fixed lookup tables for thousands, hundreds, tens, and ones.",code:`string intToRoman(int num) {
    vector<string> thousands{"","M","MM","MMM"};
    vector<string> hundreds{"","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"};
    vector<string> tens{"","X","XX","XXX","XL","L","LX","LXX","LXXX","XC"};
    vector<string> ones{"","I","II","III","IV","V","VI","VII","VIII","IX"};
    return thousands[num / 1000] + hundreds[num / 100 % 10] + tens[num / 10 % 10] + ones[num % 10];
}`},
"LC 58":{title:"Alternative: Stringstream",note:"Simpler but stores the last token implicitly through parsing.",code:`int lengthOfLastWord(string s) {
    string word, last;
    stringstream ss(s);
    while (ss >> word) last = word;
    return last.size();
}`},
"LC 14":{title:"Alternative: Sort First",note:"After sorting, only the first and last strings bound the common prefix.",code:`string longestCommonPrefix(vector<string>& strs) {
    sort(strs.begin(), strs.end());
    string a = strs.front(), b = strs.back();
    int i = 0;
    while (i < a.size() && i < b.size() && a[i] == b[i]) ++i;
    return a.substr(0, i);
}`},
"LC 151":{title:"Alternative: Split Then Reverse",note:"Clearer but uses a vector of words.",code:`string reverseWords(string s) {
    stringstream ss(s);
    vector<string> words;
    string w;
    while (ss >> w) words.push_back(w);
    reverse(words.begin(), words.end());
    string ans;
    for (int i = 0; i < words.size(); ++i) {
        if (i) ans += ' ';
        ans += words[i];
    }
    return ans;
}`},
"LC 6":{title:"Alternative: Cycle Math",note:"Avoids row simulation by using the zigzag cycle length.",code:`string convert(string s, int numRows) {
    if (numRows == 1) return s;
    int cycle = 2 * numRows - 2;
    string ans;
    for (int row = 0; row < numRows; ++row) {
        for (int i = row; i < s.size(); i += cycle) {
            ans += s[i];
            int diag = i + cycle - 2 * row;
            if (row != 0 && row != numRows - 1 && diag < s.size()) ans += s[diag];
        }
    }
    return ans;
}`},
"LC 28":{title:"Alternative: KMP",note:"Linear-time substring search using a prefix table.",code:`int strStr(string haystack, string needle) {
    int m = needle.size();
    vector<int> lps(m, 0);
    for (int i = 1, len = 0; i < m; ) {
        if (needle[i] == needle[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < haystack.size(); ++i) {
        while (j && haystack[i] != needle[j]) j = lps[j - 1];
        if (haystack[i] == needle[j]) ++j;
        if (j == m) return i - m + 1;
    }
    return -1;
}`},
"LC 383":{title:"Alternative: Sort Both Strings",note:"Works by matching needed letters against available letters, but costs O(n log n).",code:`bool canConstruct(string ransomNote, string magazine) {
    sort(ransomNote.begin(), ransomNote.end());
    sort(magazine.begin(), magazine.end());
    int i = 0, j = 0;
    while (i < ransomNote.size() && j < magazine.size()) {
        if (ransomNote[i] == magazine[j]) { ++i; ++j; }
        else ++j;
    }
    return i == ransomNote.size();
}`},
"LC 205":{title:"Alternative: Last-Seen Pattern",note:"Two strings are isomorphic if their last-seen index patterns match.",code:`bool isIsomorphic(string s, string t) {
    vector<int> a(256, 0), b(256, 0);
    for (int i = 0; i < s.size(); ++i) {
        unsigned char x = s[i], y = t[i];
        if (a[x] != b[y]) return false;
        a[x] = b[y] = i + 1;
    }
    return true;
}`},
"LC 290":{title:"Alternative: Encode Pattern",note:"Normalize both sequences into first-seen ids, then compare ids.",code:`vector<int> encodeWords(vector<string>& words) {
    unordered_map<string,int> id;
    vector<int> code;
    for (string& w : words) {
        if (!id.count(w)) id[w] = id.size();
        code.push_back(id[w]);
    }
    return code;
}

bool wordPattern(string pattern, string s) {
    vector<string> p, words;
    for (char c : pattern) p.push_back(string(1, c));
    stringstream ss(s);
    string w;
    while (ss >> w) words.push_back(w);
    return p.size() == words.size() && encodeWords(p) == encodeWords(words);
}`},
"LC 202":{title:"Alternative: HashSet Seen States",note:"Very readable cycle detection with O(number of states) space.",code:`bool isHappy(int n) {
    unordered_set<int> seen;
    while (n != 1 && !seen.count(n)) {
        seen.insert(n);
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        n = sum;
    }
    return n == 1;
}`},
"LC 66":{title:"Alternative: Build Reversed Result",note:"Useful when the input must not be mutated.",code:`vector<int> plusOne(vector<int>& digits) {
    vector<int> rev;
    int carry = 1;
    for (int i = digits.size() - 1; i >= 0; --i) {
        int sum = digits[i] + carry;
        rev.push_back(sum % 10);
        carry = sum / 10;
    }
    if (carry) rev.push_back(carry);
    reverse(rev.begin(), rev.end());
    return rev;
}`},
"LC 69":{title:"Alternative: Newton's Method",note:"Fast numeric iteration; still returns the floored integer square root.",code:`int mySqrt(int x) {
    if (x < 2) return x;
    long r = x;
    while (r * r > x) r = (r + x / r) / 2;
    return (int)r;
}`},
"LC 135":{title:"Alternative: Slope Counting",note:"O(1) space version that counts increasing and decreasing rating slopes.",code:`int candy(vector<int>& ratings) {
    int n = ratings.size(), ans = 1;
    int up = 0, down = 0, peak = 0;
    for (int i = 1; i < n; ++i) {
        if (ratings[i] > ratings[i - 1]) {
            up++;
            peak = up;
            down = 0;
            ans += 1 + up;
        } else if (ratings[i] == ratings[i - 1]) {
            up = down = peak = 0;
            ans += 1;
        } else {
            up = 0;
            down++;
            ans += 1 + down - (peak >= down ? 1 : 0);
        }
    }
    return ans;
}`},
"LC 68":{title:"Alternative: Left-Justified Formatter Helper",note:"A useful helper to isolate the last-line and single-word case.",code:`string leftJustify(vector<string>& words, int i, int j, int maxWidth) {
    string line;
    for (int k = i; k < j; ++k) {
        if (k > i) line += ' ';
        line += words[k];
    }
    line += string(maxWidth - line.size(), ' ');
    return line;
}

vector<string> fullJustify(vector<string>& words, int maxWidth) {
    vector<string> ans;
    for (int i = 0; i < words.size(); ) {
        int j = i, len = 0;
        while (j < words.size() && len + words[j].size() + (j - i) <= maxWidth) {
            len += words[j++].size();
        }
        if (j == words.size() || j - i == 1) {
            ans.push_back(leftJustify(words, i, j, maxWidth));
        } else {
            int gaps = j - i - 1, spaces = maxWidth - len;
            string line;
            for (int k = i; k < j; ++k) {
                line += words[k];
                if (k < j - 1) line += string(spaces / gaps + (k - i < spaces % gaps), ' ');
            }
            ans.push_back(line);
        }
        i = j;
    }
    return ans;
}`},
"LC 35":{title:"Alternative: STL lower_bound",note:"Same lower-bound invariant, written with the standard library.",code:`int searchInsert(vector<int>& nums, int target) {
    return lower_bound(nums.begin(), nums.end(), target) - nums.begin();
}`},
"LC 56":{title:"Alternative: Sweep Events",note:"More general interval thinking, but sorting starts and ends separately is less direct for returning merged ranges.",code:`vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;
    int start = intervals[0][0], end = intervals[0][1];
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] <= end) end = max(end, intervals[i][1]);
        else {
            ans.push_back({start, end});
            start = intervals[i][0];
            end = intervals[i][1];
        }
    }
    ans.push_back({start, end});
    return ans;
}`},
"LC 57":{title:"Alternative: Append Then Merge",note:"Simpler if input order is not trusted: append new interval, sort, then reuse merge intervals.",code:`vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    intervals.push_back(newInterval);
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;
    for (auto& in : intervals) {
        if (ans.empty() || in[0] > ans.back()[1]) ans.push_back(in);
        else ans.back()[1] = max(ans.back()[1], in[1]);
    }
    return ans;
}`},
"LC 155":{title:"Alternative: Two Stacks",note:"Keep values in one stack and minimum history in another stack.",code:`class MinStack {
    stack<int> values, mins;
public:
    void push(int val) {
        values.push(val);
        if (mins.empty() || val <= mins.top()) mins.push(val);
    }
    void pop() {
        if (values.top() == mins.top()) mins.pop();
        values.pop();
    }
    int top() { return values.top(); }
    int getMin() { return mins.top(); }
};`},
"LC 150":{title:"Alternative: Function Dispatch",note:"Same stack idea, but separates operator logic for readability.",code:`int evalRPN(vector<string>& tokens) {
    stack<int> st;
    unordered_map<string, function<int(int,int)>> op{
        {"+", [](int a,int b){ return a + b; }},
        {"-", [](int a,int b){ return a - b; }},
        {"*", [](int a,int b){ return a * b; }},
        {"/", [](int a,int b){ return a / b; }}
    };
    for (string& t : tokens) {
        if (!op.count(t)) st.push(stoi(t));
        else {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            st.push(op[t](a, b));
        }
    }
    return st.top();
}`},
"LC 141":{title:"Alternative: HashSet Visited Nodes",note:"Very readable baseline, but uses O(n) extra space.",code:`bool hasCycle(ListNode *head) {
    unordered_set<ListNode*> seen;
    while (head) {
        if (seen.count(head)) return true;
        seen.insert(head);
        head = head->next;
    }
    return false;
}`},
"LC 2":{title:"Alternative: Reuse One Input List",note:"Possible if mutation is allowed, but the dummy-output version is cleaner for interviews.",code:`ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy;
    ListNode* cur = &dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = carry + (l1 ? l1->val : 0) + (l2 ? l2->val : 0);
        carry = sum / 10;
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
        if (l1) l1 = l1->next;
        if (l2) l2 = l2->next;
    }
    return dummy.next;
}`},
"LC 104":{title:"Alternative: BFS Level Count",note:"Counts levels iteratively and avoids recursion depth.",code:`int maxDepth(TreeNode* root) {
    if (!root) return 0;
    queue<TreeNode*> q;
    q.push(root);
    int depth = 0;
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            TreeNode* node = q.front(); q.pop();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        ++depth;
    }
    return depth;
}`},
"LC 199":{title:"Alternative: DFS Right First",note:"Visit right child first; the first node seen at each depth is visible.",code:`vector<int> rightSideView(TreeNode* root) {
    vector<int> ans;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int depth) {
        if (!node) return;
        if (depth == ans.size()) ans.push_back(node->val);
        dfs(node->right, depth + 1);
        dfs(node->left, depth + 1);
    };
    dfs(root, 0);
    return ans;
}`},
"LC 208":{title:"Alternative: HashMap Children",note:"Better for large alphabets; slightly slower than fixed arrays for lowercase English.",code:`class Trie {
    struct Node {
        unordered_map<char, Node*> child;
        bool isWord = false;
    };
    Node* root = new Node();
public:
    void insert(string word) {
        Node* cur = root;
        for (char c : word) {
            if (!cur->child[c]) cur->child[c] = new Node();
            cur = cur->child[c];
        }
        cur->isWord = true;
    }
    bool search(string word) {
        Node* cur = root;
        for (char c : word) {
            if (!cur->child.count(c)) return false;
            cur = cur->child[c];
        }
        return cur->isWord;
    }
    bool startsWith(string prefix) {
        Node* cur = root;
        for (char c : prefix) {
            if (!cur->child.count(c)) return false;
            cur = cur->child[c];
        }
        return true;
    }
}`}
});
const bruteForceTemplates={
"LC 53":{title:"Brute Force Baseline",note:"Enumerate every subarray. Correct but O(n^2), useful before Kadane.",code:`int maxSubArray(vector<int>& nums) {
    int best = nums[0];
    for (int i = 0; i < nums.size(); ++i) {
        int sum = 0;
        for (int j = i; j < nums.size(); ++j) {
            sum += nums[j];
            best = max(best, sum);
        }
    }
    return best;
}`},
"LC 121":{title:"Brute Force Baseline",note:"Try every buy/sell pair. Correct but O(n^2).",code:`int maxProfit(vector<int>& prices) {
    int best = 0;
    for (int buy = 0; buy < prices.size(); ++buy)
        for (int sell = buy + 1; sell < prices.size(); ++sell)
            best = max(best, prices[sell] - prices[buy]);
    return best;
}`},
"LC 146":{title:"Brute Force Baseline",note:"Vector/list simulation is easy to understand but O(n) per operation.",code:`class LRUCache {
    int cap;
    vector<pair<int,int>> items;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        for (int i = 0; i < items.size(); ++i) {
            if (items[i].first != key) continue;
            int value = items[i].second;
            items.erase(items.begin() + i);
            items.insert(items.begin(), {key, value});
            return value;
        }
        return -1;
    }

    void put(int key, int value) {
        for (int i = 0; i < items.size(); ++i) {
            if (items[i].first != key) continue;
            items.erase(items.begin() + i);
            items.insert(items.begin(), {key, value});
            return;
        }
        if (items.size() == cap) items.pop_back();
        items.insert(items.begin(), {key, value});
    }
};`},
"LC 215":{title:"Sorting Baseline",note:"Sort first, then index the kth largest. O(n log n), very clear.",code:`int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    return nums[nums.size() - k];
}`},
"LC 347":{title:"Sorting Baseline",note:"Count frequencies, then sort by frequency. O(n log n) worst case.",code:`vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<pair<int,int>> arr;
    for (auto& [x, f] : freq) arr.push_back({f, x});
    sort(arr.rbegin(), arr.rend());
    vector<int> ans;
    for (int i = 0; i < k; ++i) ans.push_back(arr[i].second);
    return ans;
}`},
"LC 42":{title:"Brute Force Baseline",note:"For each bar, scan left and right maxima. O(n^2), simple correctness baseline.",code:`int trap(vector<int>& height) {
    int n = height.size(), ans = 0;
    for (int i = 0; i < n; ++i) {
        int leftMax = 0, rightMax = 0;
        for (int l = 0; l <= i; ++l) leftMax = max(leftMax, height[l]);
        for (int r = i; r < n; ++r) rightMax = max(rightMax, height[r]);
        ans += min(leftMax, rightMax) - height[i];
    }
    return ans;
}`}
};
const patternApproachExtras={
"LC 11":[{title:"Greedy Proof Template",note:"Same code as two pointers; the greedy part is why moving the shorter side is safe.",code:`int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, ans = 0;
    while (l < r) {
        int width = r - l;
        int low = min(height[l], height[r]);
        ans = max(ans, width * low);

        // Greedy discard: the shorter side is the limiting height.
        // Keeping it while width shrinks cannot improve the area.
        if (height[l] < height[r]) ++l;
        else --r;
    }
    return ans;
}`}],
"LC 200":[{title:"Union Find Approach",note:"Graph connected components without recursive DFS/BFS. Time near O(mn).",code:`class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) swap(ra, rb);
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
};

int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), count = 0;
    DSU dsu(m * n);
    vector<pair<int,int>> dirs{{1,0},{0,1}};
    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (grid[r][c] != '1') continue;
            count++;
            for (auto [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= m || nc >= n || grid[nr][nc] != '1') continue;
                if (dsu.unite(r * n + c, nr * n + nc)) count--;
            }
        }
    }
    return count;
}`}],
"LC 189":[{title:"Two-Pointer Reverse Helper",note:"Same O(1) space rotation idea, with the reversal written explicitly.",code:`void reverseRange(vector<int>& nums, int l, int r) {
    while (l < r) {
        swap(nums[l], nums[r]);
        ++l;
        --r;
    }
}

void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverseRange(nums, 0, n - 1);
    reverseRange(nums, 0, k - 1);
    reverseRange(nums, k, n - 1);
}`}],
"LC 45":[{title:"Implicit BFS Layer Approach",note:"Each jump is one BFS layer; greedily keep the farthest next boundary. O(n).",code:`int jump(vector<int>& nums) {
    int jumps = 0, layerEnd = 0, nextEnd = 0;
    for (int i = 0; i < nums.size() - 1; ++i) {
        nextEnd = max(nextEnd, i + nums[i]);
        if (i == layerEnd) {
            jumps++;
            layerEnd = nextEnd;
        }
    }
    return jumps;
}`}],
"LC 42":[{title:"Monotonic Stack Approach",note:"Stack stores bars waiting for a right boundary. Time O(n), space O(n).",code:`int trap(vector<int>& height) {
    stack<int> st;
    int ans = 0;
    for (int i = 0; i < height.size(); ++i) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int bottom = st.top();
            st.pop();
            if (st.empty()) break;
            int left = st.top();
            int width = i - left - 1;
            int bounded = min(height[left], height[i]) - height[bottom];
            ans += width * bounded;
        }
        st.push(i);
    }
    return ans;
}`}]
};
let filtered=[...problems],current=0,selected=false,hintCount=0,activeMode="drill",optionSets={};
let score=Number(localStorage.getItem("lc_score_ext")||0),streak=Number(localStorage.getItem("lc_streak_ext")||0),done=Number(localStorage.getItem("lc_done_ext")||0),wrongBank=JSON.parse(localStorage.getItem("lc_wrongBank_ext")||"[]");
let dailyStats=JSON.parse(localStorage.getItem("lc_daily_ext")||"{}"),calendarCursor=new Date();
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),shuffle=arr=>[...arr].sort(()=>Math.random()-.5);
const englishNotes={
"LC 1":{signal:"Pair sum + target usually points to a complement lookup with a hashmap.",hints:["Start with the O(n^2) brute force over every pair.","For each nums[i], the missing value is target - nums[i].","Store value -> index after checking, so you never reuse the same element.","Duplicates are fine because indices are distinct."],review:"When you see pair + target, think complement map first."},
"LC 3":{signal:"Substring + longest + no repeats points to a sliding window with a no-duplicate invariant.",hints:["Enumerating every substring is too slow.","Maintain a window [left, right] and add one character at a time.","If the new character already exists in the window, move left past the previous occurrence.","left only moves forward; never move it backward."],review:"Move left only when the duplicate is inside the current window; after the update, the window is valid."},
"LC 11":{signal:"Choosing two ends with area limited by the shorter side points to two pointers.",hints:["Brute force checks every pair in O(n^2).","Start with the widest container, l = 0 and r = n - 1.","Area is limited by min(height[l], height[r]).","Since width only decreases, move the shorter side to seek a taller limiting wall."],review:"Width decreases irreversibly, so the only possible improvement is raising the limiting height."},
"LC 15":{signal:"Unique triplets + target sum points to sorting, fixing one value, then two pointers.",hints:["Sorting makes duplicate skipping and pointer movement manageable.","Fix i, then solve two-sum on the right side for -nums[i].","If sum is too small, move left; if too large, move right.","After recording a triplet, skip duplicate left and right values."],review:"Sort, fix one value, use two pointers; duplicate handling is the core detail."},
"LC 20":{signal:"Nested bracket matching points to a stack because the most recent opener closes first.",hints:["The latest opened bracket must be closed first.","That is exactly LIFO behavior.","Pushing the expected closing bracket makes comparisons simple.","At the end, the stack must be empty."],review:"Nested matching means stack; pushing expected closers is the cleanest implementation."},
"LC 33":{signal:"O(log n) search in a rotated sorted array points to binary search where one half is always sorted.",hints:["The whole array is not sorted, but one side of every split is sorted.","Use nums[l] <= nums[mid] to identify whether the left half is sorted.","If target lies in the sorted half, search there.","Otherwise discard that half."],review:"At each step, identify the sorted half, then decide whether target belongs inside it."},
"LC 49":{signal:"Grouping equivalent strings points to a hashmap key design problem.",hints:["Anagrams share the same character multiset.","The simplest key is the sorted version of the string.","Use map: key -> original strings.","For long strings, a 26-count frequency key can avoid sorting."],review:"Anagram grouping is mainly about designing a stable key; sorted-string key is the safest default."},
"LC 53":{signal:"Maximum contiguous subarray points to Kadane's DP: max sum ending here.",hints:["At each position, decide whether to extend the previous subarray or restart here.","cur = max(nums[i], cur + nums[i]).","Update best at every step.","Initialize from nums[0] to handle all-negative arrays."],review:"For contiguous subarray max, the decision is always extend or restart."},
"LC 76":{signal:"Minimum substring covering required characters points to sliding window with need/window counts.",hints:["Count how many of each character t requires.","Expand right until the window satisfies all requirements.","Once valid, shrink left while preserving validity.","formed/required tracks how many character types are fully satisfied."],review:"Minimum cover: expand until valid, then shrink until it would become invalid."},
"LC 98":{signal:"BST validation must respect ancestor bounds, not just the direct parent.",hints:["Checking only node.left < node < node.right is not enough.","Every node inherits a legal value range from its ancestors.","Left subtree range becomes (low, node.val).","Right subtree range becomes (node.val, high)."],review:"For BST validation, think ancestor bounds, not only parent comparison."},
"LC 102":{signal:"Level-order traversal points to BFS with a queue and fixed level sizes.",hints:["Level order means processing nodes one layer at a time.","A queue gives first-in-first-out order.","At each round, queue.size() is the number of nodes in the current level.","After processing a node, push its children for the next level."],review:"Layer-by-layer traversal means BFS queue plus fixed size per level."},
"LC 128":{signal:"O(n) longest consecutive sequence points to a hash set and expanding only from sequence starts.",hints:["Sorting is O(n log n), but the problem asks for O(n).","Put every number into a set.","Only x with no x-1 can start a sequence.","Expand from the start through x+1, x+2, and so on."],review:"Expand only from starts to avoid scanning the same sequence repeatedly."},
"LC 146":{signal:"O(1) lookup plus recency order points to hashmap + doubly linked list.",hints:["A hashmap gives O(1) lookup but not recency order.","A doubly linked list supports O(1) removal and move-to-front.","Keep most recently used near the head and least recently used near the tail.","Both get and put must refresh recency."],review:"O(1) lookup + O(1) recency updates = hashmap plus doubly linked list."},
"LC 200":{signal:"Counting islands is counting connected components in an implicit grid graph.",hints:["Each land cell is a graph node.","Four-directional adjacency forms edges.","When you find unvisited land, count one island and flood-fill it.","DFS or BFS both work."],review:"Grid islands are connected components; every new unvisited land cell starts one flood fill."},
"LC 207":{signal:"Prerequisites form a directed graph; finishing all courses means detecting no cycle.",hints:["Courses are nodes and prerequisites are directed edges.","A cycle means the schedule is impossible.","Topological sort uses indegree and a queue.","If you can remove all nodes, there is no cycle."],review:"Course dependency feasibility is directed-cycle detection."},
"LC 215":{signal:"Kth largest / top-k points to a heap or quickselect.",hints:["Sorting works but costs O(n log n).","Maintain a min-heap of size k.","The heap top is the current kth largest.","After scanning all values, the top is the answer."],review:"For top-k, a min-heap of size k keeps the kth largest at the top."},
"LC 238":{signal:"Product except self without division points to prefix/suffix decomposition.",hints:["answer[i] equals product of everything left of i times everything right of i.","First pass stores prefix products in ans.","Second pass multiplies a running suffix product from the right.","The output array does not count as extra space."],review:"Except self means left information times right information."}
};
Object.assign(alternativeSolutions,{
"LC 64":{title:"Alternative: 1D DP Without Mutating Grid",note:"Use this when the input grid must stay unchanged. O(mn) time, O(n) space.",code:`int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size();
    int n = grid[0].size();
    vector<int> dp(n, 0);

    dp[0] = grid[0][0];
    for (int j = 1; j < n; ++j) {
        dp[j] = dp[j - 1] + grid[0][j];
    }

    for (int i = 1; i < m; ++i) {
        dp[0] += grid[i][0];
        for (int j = 1; j < n; ++j) {
            dp[j] = min(dp[j], dp[j - 1]) + grid[i][j];
        }
    }

    return dp[n - 1];
}`}
});
const englishAltMeta={
"LC 1":["Alternative: Sort + Two Pointers (preserve original indices)","Use this when discussing sorted input or memory tradeoffs. Time O(n log n), space O(n)."],
"LC 3":["Alternative: HashSet Window","More intuitive window implementation: maintain a set with no duplicates. Time O(n)."],
"LC 11":["Alternative: Brute Force Baseline","Not optimal, but useful for explaining why two pointers are needed. Time O(n^2)."],
"LC 15":["Alternative: Brute Force + Set Deduplication","Baseline for explaining why sorting and two pointers are better. Time O(n^3 log n)."],
"LC 20":["Alternative: Push Open Brackets","Common variant: store open brackets and compare against a closing-bracket map. Time O(n)."],
"LC 33":["Alternative: Find Pivot, Then Binary Search","Splits the problem into two familiar steps. Time O(log n)."],
"LC 49":["Alternative: 26-count Frequency Key","Avoids sorting each string when input is lowercase English. Time O(n*k)."],
"LC 53":["Alternative: Prefix Sum + Minimum Prefix","Reframes answer as prefix[j] - minPrefixBeforeJ. Time O(n)."],
"LC 76":["Alternative: ASCII Count Arrays","Faster than unordered_map when the character set is fixed. Time O(n+m)."],
"LC 98":["Alternative: Inorder Traversal","A valid BST has a strictly increasing inorder traversal. Time O(n)."],
"LC 102":["Alternative: DFS with Depth","No queue needed; place each node into ans[depth]. Time O(n)."],
"LC 128":["Alternative: Sorting","Straightforward but not O(n); useful as a baseline. Time O(n log n)."],
"LC 146":["Alternative: Manual Doubly Linked List","Use this if asked to implement the linked list yourself. O(1) get/put."],
"LC 200":["Alternative: BFS Flood Fill","Avoids recursion depth risk. Time O(mn)."],
"LC 207":["Alternative: DFS Color Cycle Detection","Use 0=unvisited, 1=visiting, 2=done. Visiting again means cycle."],
"LC 215":["Alternative: Quickselect","Average O(n), worst-case O(n^2); useful when asked for better average time."],
"LC 238":["Alternative: Explicit Prefix and Suffix Arrays","Clearest conceptually, then optimize to O(1) extra space."]
};
const studyMeta={
"LC 1":{sourceUrl:"https://leetcode.com/problems/two-sum/",examples:[{input:"nums = [2,7,11,15], target = 9",output:"[0,1]",note:"nums[0] + nums[1] = 9."},{input:"nums = [3,2,4], target = 6",output:"[1,2]"}],constraints:["2 <= nums.length <= 10^4","-10^9 <= nums[i], target <= 10^9","Exactly one valid answer exists."]},
"LC 3":{sourceUrl:"https://leetcode.com/problems/longest-substring-without-repeating-characters/",examples:[{input:'s = "abcabcbb"',output:"3",note:'The answer is "abc".'},{input:'s = "bbbbb"',output:"1",note:'The answer is "b".'}],constraints:["0 <= s.length <= 5 * 10^4","s may contain English letters, digits, symbols, and spaces."]},
"LC 11":{sourceUrl:"https://leetcode.com/problems/container-with-most-water/",examples:[{input:"height = [1,8,6,2,5,4,8,3,7]",output:"49"},{input:"height = [1,1]",output:"1"}],constraints:["2 <= height.length <= 10^5","0 <= height[i] <= 10^4"]},
"LC 15":{sourceUrl:"https://leetcode.com/problems/3sum/",examples:[{input:"nums = [-1,0,1,2,-1,-4]",output:"[[-1,-1,2],[-1,0,1]]"},{input:"nums = [0,1,1]",output:"[]"}],constraints:["3 <= nums.length <= 3000","-10^5 <= nums[i] <= 10^5"]},
"LC 20":{sourceUrl:"https://leetcode.com/problems/valid-parentheses/",examples:[{input:'s = "()"',output:"true"},{input:'s = "()[]{}"',output:"true"},{input:'s = "(]"',output:"false"}],constraints:["1 <= s.length <= 10^4","s contains only '(', ')', '{', '}', '[' and ']'."]},
"LC 33":{sourceUrl:"https://leetcode.com/problems/search-in-rotated-sorted-array/",examples:[{input:"nums = [4,5,6,7,0,1,2], target = 0",output:"4"},{input:"nums = [4,5,6,7,0,1,2], target = 3",output:"-1"}],constraints:["1 <= nums.length <= 5000","-10^4 <= nums[i], target <= 10^4","All nums values are unique.","nums is sorted in ascending order and possibly rotated."]},
"LC 49":{sourceUrl:"https://leetcode.com/problems/group-anagrams/",examples:[{input:'strs = ["eat","tea","tan","ate","nat","bat"]',output:'[["bat"],["nat","tan"],["ate","eat","tea"]]',note:"Group order is not important."},{input:'strs = [""]',output:'[[""]]'}],constraints:["1 <= strs.length <= 10^4","0 <= strs[i].length <= 100","strs[i] contains lowercase English letters."]},
"LC 53":{sourceUrl:"https://leetcode.com/problems/maximum-subarray/",examples:[{input:"nums = [-2,1,-3,4,-1,2,1,-5,4]",output:"6",note:"The subarray [4,-1,2,1] has the largest sum."},{input:"nums = [1]",output:"1"}],constraints:["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"]},
"LC 76":{sourceUrl:"https://leetcode.com/problems/minimum-window-substring/",examples:[{input:'s = "ADOBECODEBANC", t = "ABC"',output:'"BANC"'},{input:'s = "a", t = "a"',output:'"a"'}],constraints:["1 <= s.length, t.length <= 10^5","s and t contain uppercase and lowercase English letters.","The answer is unique when it exists."]},
"LC 98":{sourceUrl:"https://leetcode.com/problems/validate-binary-search-tree/",examples:[{input:"root = [2,1,3]",output:"true"},{input:"root = [5,1,4,null,null,3,6]",output:"false",note:"3 is in the right subtree of 5 but is smaller than 5."}],constraints:["1 <= number of nodes <= 10^4","-2^31 <= Node.val <= 2^31 - 1"]},
"LC 102":{sourceUrl:"https://leetcode.com/problems/binary-tree-level-order-traversal/",examples:[{input:"root = [3,9,20,null,null,15,7]",output:"[[3],[9,20],[15,7]]"},{input:"root = [1]",output:"[[1]]"}],constraints:["0 <= number of nodes <= 2000","-1000 <= Node.val <= 1000"]},
"LC 128":{sourceUrl:"https://leetcode.com/problems/longest-consecutive-sequence/",examples:[{input:"nums = [100,4,200,1,3,2]",output:"4",note:"The sequence is [1,2,3,4]."},{input:"nums = [0,3,7,2,5,8,4,6,0,1]",output:"9"}],constraints:["0 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9","Required time complexity is O(n)."]},
"LC 146":{sourceUrl:"https://leetcode.com/problems/lru-cache/",examples:[{input:'operations = ["LRUCache","put","put","get","put","get","put","get","get","get"], args = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',output:"[null,null,null,1,null,-1,null,-1,3,4]",note:"Capacity is 2; least recently used keys are evicted first."}],constraints:["1 <= capacity <= 3000","0 <= key, value <= 10^4","At most 2 * 10^5 calls will be made.","get and put must run in O(1) average time."]},
"LC 200":{sourceUrl:"https://leetcode.com/problems/number-of-islands/",examples:[{input:'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',output:"1"},{input:'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',output:"3"}],constraints:["1 <= m, n <= 300","grid[i][j] is '0' or '1'."]},
"LC 207":{sourceUrl:"https://leetcode.com/problems/course-schedule/",examples:[{input:"numCourses = 2, prerequisites = [[1,0]]",output:"true",note:"Take course 0 before course 1."},{input:"numCourses = 2, prerequisites = [[1,0],[0,1]]",output:"false",note:"The two courses depend on each other."}],constraints:["1 <= numCourses <= 2000","0 <= prerequisites.length <= 5000","Each prerequisite pair is unique."]},
"LC 215":{sourceUrl:"https://leetcode.com/problems/kth-largest-element-in-an-array/",examples:[{input:"nums = [3,2,1,5,6,4], k = 2",output:"5"},{input:"nums = [3,2,3,1,2,4,5,5,6], k = 4",output:"4"}],constraints:["1 <= k <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"]},
"LC 238":{sourceUrl:"https://leetcode.com/problems/product-of-array-except-self/",examples:[{input:"nums = [1,2,3,4]",output:"[24,12,8,6]"},{input:"nums = [-1,1,0,-3,3]",output:"[0,0,9,0,0]"}],constraints:["2 <= nums.length <= 10^5","-30 <= nums[i] <= 30","The product of any prefix or suffix fits in a 32-bit integer.","Do not use division."]},
"LC 121":{sourceUrl:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",examples:[{input:"prices = [7,1,5,3,6,4]",output:"5",note:"Buy at 1 and sell at 6."},{input:"prices = [7,6,4,3,1]",output:"0",note:"No profitable transaction exists."}],constraints:["1 <= prices.length <= 10^5","0 <= prices[i] <= 10^4"]},
"LC 125":{sourceUrl:"https://leetcode.com/problems/valid-palindrome/",examples:[{input:'s = "A man, a plan, a canal: Panama"',output:"true"},{input:'s = "race a car"',output:"false"}],constraints:["1 <= s.length <= 2 * 10^5","s consists only of printable ASCII characters."]},
"LC 217":{sourceUrl:"https://leetcode.com/problems/contains-duplicate/",examples:[{input:"nums = [1,2,3,1]",output:"true"},{input:"nums = [1,2,3,4]",output:"false"}],constraints:["1 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9"]},
"LC 242":{sourceUrl:"https://leetcode.com/problems/valid-anagram/",examples:[{input:'s = "anagram", t = "nagaram"',output:"true"},{input:'s = "rat", t = "car"',output:"false"}],constraints:["1 <= s.length, t.length <= 5 * 10^4","s and t contain lowercase English letters."]},
"LC 226":{sourceUrl:"https://leetcode.com/problems/invert-binary-tree/",examples:[{input:"root = [4,2,7,1,3,6,9]",output:"[4,7,2,9,6,3,1]"},{input:"root = [2,1,3]",output:"[2,3,1]"}],constraints:["0 <= number of nodes <= 100","-100 <= Node.val <= 100"]},
"LC 347":{sourceUrl:"https://leetcode.com/problems/top-k-frequent-elements/",examples:[{input:"nums = [1,1,1,2,2,3], k = 2",output:"[1,2]"},{input:"nums = [1], k = 1",output:"[1]"}],constraints:["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","k is in the range [1, number of unique elements].","The answer is unique.","Aim for better than O(n log n)."]}
};

Object.assign(studyMeta,{
"LC 122":{sourceUrl:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",examples:[{"input":"prices = [7,1,5,3,6,4]","output":"7","note":"Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4. Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3. Total profit is 4 + 3 = 7."},{"input":"prices = [1,2,3,4,5]","output":"4","note":"Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4. Total profit is 4."}],constraints:["1 \u003c= prices.length \u003c= 3 * 10^4","0 \u003c= prices[i] \u003c= 10^4"]},
"LC 392":{sourceUrl:"https://leetcode.com/problems/is-subsequence/",examples:[{"input":"s = \"abc\", t = \"ahbgdc\"","output":"true"},{"input":"s = \"axc\", t = \"ahbgdc\"","output":"false"}],constraints:["0 \u003c= s.length \u003c= 100","0 \u003c= t.length \u003c= 10^4","s and t consist only of lowercase English letters."]},
"LC 30":{sourceUrl:"https://leetcode.com/problems/substring-with-concatenation-of-all-words/",examples:[{"input":"s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]","output":"[0,9]","note":"\"barfoo\" starts at 0 and \"foobar\" starts at 9."},{"input":"s = \"wordgoodgoodgoodbestword\", words = [\"word\",\"good\",\"best\",\"word\"]","output":"[]","note":"There is no substring that concatenates every required word exactly once."},{"input":"s = \"barfoofoobarthefoobarman\", words = [\"bar\",\"foo\",\"the\"]","output":"[6,9,12]","note":"Valid starts form \"foobarthe\", \"barthefoo\", and \"thefoobar\"."}],constraints:["1 \u003c= s.length \u003c= 10^4","1 \u003c= words.length \u003c= 5000","1 \u003c= words[i].length \u003c= 30","s and words[i] consist of lowercase English letters."]},
"LC 36":{sourceUrl:"https://leetcode.com/problems/valid-sudoku/",examples:[{"input":"board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"] ,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"] ,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"] ,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"] ,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"] ,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"] ,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"] ,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"] ,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]","output":"true"},{"input":"board = [[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"] ,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"] ,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"] ,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"] ,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"] ,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"] ,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"] ,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"] ,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]","output":"false","note":"Same as Example 1, except with the 5 in the top left corner being modified to 8 . Since there are two 8's in the top left 3x3 sub-box, it is invalid."}],constraints:["board.length == 9","board[i].length == 9","board[i][j] is a digit 1-9 or '.' ."]},
"LC 54":{sourceUrl:"https://leetcode.com/problems/spiral-matrix/",examples:[{"input":"matrix = [[1,2,3],[4,5,6],[7,8,9]]","output":"[1,2,3,6,9,8,7,4,5]"},{"input":"matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]","output":"[1,2,3,4,8,12,11,10,9,5,6,7]"}],constraints:["m == matrix.length","n == matrix[i].length","1 \u003c= m, n \u003c= 10","-100 \u003c= matrix[i][j] \u003c= 100"]},
"LC 48":{sourceUrl:"https://leetcode.com/problems/rotate-image/",examples:[{"input":"matrix = [[1,2,3],[4,5,6],[7,8,9]]","output":"[[7,4,1],[8,5,2],[9,6,3]]"},{"input":"matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]","output":"[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]"}],constraints:["n == matrix.length == matrix[i].length","1 \u003c= n \u003c= 20","-1000 \u003c= matrix[i][j] \u003c= 1000"]},
"LC 73":{sourceUrl:"https://leetcode.com/problems/set-matrix-zeroes/",examples:[{"input":"matrix = [[1,1,1],[1,0,1],[1,1,1]]","output":"[[1,0,1],[0,0,0],[1,0,1]]"},{"input":"matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]","output":"[[0,0,0,0],[0,4,5,0],[0,3,1,0]]"}],constraints:["m == matrix.length","n == matrix[0].length","1 \u003c= m, n \u003c= 200","-2^31 \u003c= matrix[i][j] \u003c= 2^31 - 1","A straightforward solution using O(mn) space is probably a bad idea.","A simple improvement uses O(m + n) space, but still not the best solution.","Could you devise a constant space solution?"]},
"LC 289":{sourceUrl:"https://leetcode.com/problems/game-of-life/",examples:[{"input":"board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]","output":"[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]"},{"input":"board = [[1,1],[1,0]]","output":"[[1,1],[1,1]]"}],constraints:["m == board.length","n == board[i].length","1 \u003c= m, n \u003c= 25","board[i][j] is 0 or 1 .","Could you solve it in-place? Remember that the board needs to be updated simultaneously: You cannot update some cells first and then use their updated values to update other cells.","In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches upon the border of the array (i.e., live cells reach the border). How would you address these problems?"]},
"LC 224":{sourceUrl:"https://leetcode.com/problems/basic-calculator/",examples:[{"input":"s = \"1 + 1\"","output":"2"},{"input":"s = \" 2-1 + 2 \"","output":"3"}],constraints:["1 \u003c= s.length \u003c= 3 * 10^5","s consists of digits, '+' , '-' , '(' , ')' , and ' ' .","s represents a valid expression.","'+' is not used as a unary operation (i.e., \"+1\" and \"+(2 + 3)\" is invalid).","'-' could be used as a unary operation (i.e., \"-1\" and \"-(2 + 3)\" is valid).","There will be no two consecutive operators in the input.","Every number and running calculation will fit in a signed 32-bit integer."]},
"LC 138":{sourceUrl:"https://leetcode.com/problems/copy-list-with-random-pointer/",examples:[{"input":"head = [[7,null],[13,0],[11,4],[10,2],[1,0]]","output":"[[7,null],[13,0],[11,4],[10,2],[1,0]]"},{"input":"head = [[1,1],[2,1]]","output":"[[1,1],[2,1]]"}],constraints:["0 \u003c= n \u003c= 1000","-10^4 \u003c= Node.val \u003c= 10^4","Node.random is null or is pointing to some node in the linked list."]},
"LC 92":{sourceUrl:"https://leetcode.com/problems/reverse-linked-list-ii/",examples:[{"input":"head = [1,2,3,4,5], left = 2, right = 4","output":"[1,4,3,2,5]"},{"input":"head = [5], left = 1, right = 1","output":"[5]"}],constraints:["The number of nodes in the list is n .","1 \u003c= n \u003c= 500","-500 \u003c= Node.val \u003c= 500","1 \u003c= left \u003c= right \u003c= n"]},
"LC 25":{sourceUrl:"https://leetcode.com/problems/reverse-nodes-in-k-group/",examples:[{"input":"head = [1,2,3,4,5], k = 2","output":"[2,1,4,3,5]"},{"input":"head = [1,2,3,4,5], k = 3","output":"[3,2,1,4,5]"}],constraints:["The number of nodes in the list is n .","1 \u003c= k \u003c= n \u003c= 5000","0 \u003c= Node.val \u003c= 1000"]},
"LC 82":{sourceUrl:"https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",examples:[{"input":"head = [1,2,3,3,4,4,5]","output":"[1,2,5]"},{"input":"head = [1,1,1,2,3]","output":"[2,3]"}],constraints:["The number of nodes in the list is in the range [0, 300] .","-100 \u003c= Node.val \u003c= 100","The list is guaranteed to be sorted in ascending order."]},
"LC 61":{sourceUrl:"https://leetcode.com/problems/rotate-list/",examples:[{"input":"head = [1,2,3,4,5], k = 2","output":"[4,5,1,2,3]"},{"input":"head = [0,1,2], k = 4","output":"[2,0,1]"}],constraints:["The number of nodes in the list is in the range [0, 500] .","-100 \u003c= Node.val \u003c= 100","0 \u003c= k \u003c= 2 * 10^9"]},
"LC 86":{sourceUrl:"https://leetcode.com/problems/partition-list/",examples:[{"input":"head = [1,4,3,2,5,2], x = 3","output":"[1,2,2,4,3,5]"},{"input":"head = [2,1], x = 2","output":"[1,2]"}],constraints:["The number of nodes in the list is in the range [0, 200] .","-100 \u003c= Node.val \u003c= 100","-200 \u003c= x \u003c= 200"]},
"LC 106":{sourceUrl:"https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",examples:[{"input":"inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]","output":"[3,9,20,null,null,15,7]"},{"input":"inorder = [-1], postorder = [-1]","output":"[-1]"}],constraints:["1 \u003c= inorder.length \u003c= 3000","postorder.length == inorder.length","-3000 \u003c= inorder[i], postorder[i] \u003c= 3000","inorder and postorder consist of unique values.","Each value of postorder also appears in inorder .","inorder is guaranteed to be the inorder traversal of the tree.","postorder is guaranteed to be the postorder traversal of the tree."]},
"LC 117":{sourceUrl:"https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",examples:[{"input":"root = [1,2,3,4,5,null,7]","output":"[1,#,2,3,#,4,5,7,#] Explanation: Given the above binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B. The serialized output is in level order as connected by the next pointers, with '#' signifying the end of each level."},{"input":"root = []","output":"[]"}],constraints:["The number of nodes in the tree is in the range [0, 6000] .","-100 \u003c= Node.val \u003c= 100","You may only use constant extra space.","The recursive approach is fine. You may assume implicit stack space does not count as extra space for this problem."]},
"LC 114":{sourceUrl:"https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",examples:[{"input":"root = [1,2,5,3,4,null,6]","output":"[1,null,2,null,3,null,4,null,5,null,6]"},{"input":"root = []","output":"[]"}],constraints:["The number of nodes in the tree is in the range [0, 2000] .","-100 \u003c= Node.val \u003c= 100"]},
"LC 124":{sourceUrl:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",examples:[{"input":"root = [1,2,3]","output":"6","note":"The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6."},{"input":"root = [-10,9,20,null,null,15,7]","output":"42","note":"The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42."}],constraints:["The number of nodes in the tree is in the range [1, 3 * 10^4] .","-1000 \u003c= Node.val \u003c= 1000"]},
"LC 173":{sourceUrl:"https://leetcode.com/problems/binary-search-tree-iterator/",examples:[{"input":"operations = [\"BSTIterator\",\"next\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\"], args = [[[7,3,15,null,null,9,20]],[],[],[],[],[],[],[],[],[]]","output":"[null,3,7,true,9,true,15,true,20,false]","note":"The iterator returns the BST inorder sequence: 3, 7, 9, 15, 20."}],constraints:["The number of nodes in the tree is in the range [1, 10^5] .","0 \u003c= Node.val \u003c= 10^6","At most 10^5 calls will be made to hasNext , and next .","Could you implement next() and hasNext() to run in average O(1) time and use O(h) memory, where h is the height of the tree?"]},
"LC 222":{sourceUrl:"https://leetcode.com/problems/count-complete-tree-nodes/",examples:[{"input":"root = [1,2,3,4,5,6]","output":"6"},{"input":"root = []","output":"0"}],constraints:["The number of nodes in the tree is in the range [0, 5 * 10^4] .","0 \u003c= Node.val \u003c= 5 * 10^4","The tree is guaranteed to be complete ."]},
"LC 637":{sourceUrl:"https://leetcode.com/problems/average-of-levels-in-binary-tree/",examples:[{"input":"root = [3,9,20,null,null,15,7]","output":"[3.00000,14.50000,11.00000] Explanation: The average value of nodes on level 0 is 3, on level 1 is 14.5, and on level 2 is 11. Hence return [3, 14.5, 11]."},{"input":"root = [3,9,20,15,7]","output":"[3.00000,14.50000,11.00000]"}],constraints:["The number of nodes in the tree is in the range [1, 10^4] .","-2^31 \u003c= Node.val \u003c= 2^31 - 1"]},
"LC 103":{sourceUrl:"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",examples:[{"input":"root = [3,9,20,null,null,15,7]","output":"[[3],[20,9],[15,7]]"},{"input":"root = [1]","output":"[[1]]"}],constraints:["The number of nodes in the tree is in the range [0, 2000] .","-100 \u003c= Node.val \u003c= 100"]},
"LC 530":{sourceUrl:"https://leetcode.com/problems/minimum-absolute-difference-in-bst/",examples:[{"input":"root = [4,2,6,1,3]","output":"1"},{"input":"root = [1,0,48,null,null,12,49]","output":"1"}],constraints:["The number of nodes in the tree is in the range [2, 10^4] .","0 \u003c= Node.val \u003c= 10^5"]},
"LC 130":{sourceUrl:"https://leetcode.com/problems/surrounded-regions/",examples:[{"input":"board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]","output":"[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]","note":"The bottom O stays because it touches the border; the enclosed region is captured."},{"input":"board = [[\"X\"]]","output":"[[\"X\"]]"}],constraints:["m == board.length","n == board[i].length","1 \u003c= m, n \u003c= 200","board[i][j] is 'X' or 'O' ."]},
"LC 399":{sourceUrl:"https://leetcode.com/problems/evaluate-division/",examples:[{"input":"equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]","output":"[6.00000,0.50000,-1.00000,1.00000,-1.00000]","note":"Given: a / b = 2.0 , b / c = 3.0 queries are: a / c = ? , b / a = ? , a / e = ? , a / a = ? , x / x = ? return: [6.0, 0.5, -1.0, 1.0, -1.0 ] note: x is undefined => -1.0"},{"input":"equations = [[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]], values = [1.5,2.5,5.0], queries = [[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]","output":"[3.75000,0.40000,5.00000,0.20000]"}],constraints:["1 \u003c= equations.length \u003c= 20","equations[i].length == 2","1 \u003c= A i .length, B i .length \u003c= 5","values.length == equations.length","0.0 \u003c values[i] \u003c= 20.0","1 \u003c= queries.length \u003c= 20","queries[i].length == 2","1 \u003c= C j .length, D j .length \u003c= 5"]},
"LC 210":{sourceUrl:"https://leetcode.com/problems/course-schedule-ii/",examples:[{"input":"numCourses = 2, prerequisites = [[1,0]]","output":"[0,1]","note":"There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1]."},{"input":"numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]","output":"[0,2,1,3]","note":"There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0. So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3]."}],constraints:["1 \u003c= numCourses \u003c= 2000","0 \u003c= prerequisites.length \u003c= numCourses * (numCourses - 1)","prerequisites[i].length == 2","0 \u003c= a i , b i \u003c numCourses","a i != b i","All the pairs [a i , b i ] are distinct ."]},
"LC 909":{sourceUrl:"https://leetcode.com/problems/snakes-and-ladders/",examples:[{"input":"board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]","output":"4","note":"In the beginning, you start at square 1 (at row 5, column 0). You decide to move to square 2 and must take the ladder to square 15. You then decide to move to square 17 and must take the snake to square 13. You then decide to move to square 14 and must take the ladder to square 35. You then decide to move to square 36, ending the game. This is the lowest possible number of moves to reach the last square, so return 4."},{"input":"board = [[-1,-1],[-1,3]]","output":"1"}],constraints:["n == board.length == board[i].length","2 \u003c= n \u003c= 20","board[i][j] is either -1 or in the range [1, n^2] .","The squares labeled 1 and n^2 are not the starting points of any snake or ladder."]},
"LC 212":{sourceUrl:"https://leetcode.com/problems/word-search-ii/",examples:[{"input":"board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]","output":"[\"eat\",\"oath\"]"},{"input":"board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]","output":"[]"}],constraints:["m == board.length","n == board[i].length","1 \u003c= m, n \u003c= 12","board[i][j] is a lowercase English letter.","1 \u003c= words.length \u003c= 3 * 10^4","1 \u003c= words[i].length \u003c= 10","words[i] consists of lowercase English letters.","All the strings of words are unique."]},
"LC 17":{sourceUrl:"https://leetcode.com/problems/letter-combinations-of-a-phone-number/",examples:[{"input":"digits = \"23\"","output":"[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"},{"input":"digits = \"2\"","output":"[\"a\",\"b\",\"c\"]"}],constraints:["1 \u003c= digits.length \u003c= 4","digits[i] is a digit in the range ['2', '9'] ."]},
"LC 77":{sourceUrl:"https://leetcode.com/problems/combinations/",examples:[{"input":"n = 4, k = 2","output":"[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]","note":"There are 4 choose 2 = 6 total combinations. Note that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination."},{"input":"n = 1, k = 1","output":"[[1]]","note":"There is 1 choose 1 = 1 total combination."}],constraints:["1 \u003c= n \u003c= 20","1 \u003c= k \u003c= n"]},
"LC 46":{sourceUrl:"https://leetcode.com/problems/permutations/",examples:[{"input":"nums = [1,2,3]","output":"[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"},{"input":"nums = [0,1]","output":"[[0,1],[1,0]]"}],constraints:["1 \u003c= nums.length \u003c= 6","-10 \u003c= nums[i] \u003c= 10","All the integers of nums are unique ."]},
"LC 39":{sourceUrl:"https://leetcode.com/problems/combination-sum/",examples:[{"input":"candidates = [2,3,6,7], target = 7","output":"[[2,2,3],[7]]","note":"2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations."},{"input":"candidates = [2,3,5], target = 8","output":"[[2,2,2,2],[2,3,3],[3,5]]"}],constraints:["1 \u003c= candidates.length \u003c= 30","2 \u003c= candidates[i] \u003c= 40","All elements of candidates are distinct .","1 \u003c= target \u003c= 40"]},
"LC 52":{sourceUrl:"https://leetcode.com/problems/n-queens-ii/",examples:[{"input":"n = 4","output":"2","note":"There are two distinct solutions to the 4-queens puzzle as shown."},{"input":"n = 1","output":"1"}],constraints:["1 \u003c= n \u003c= 9"]},
"LC 79":{sourceUrl:"https://leetcode.com/problems/word-search/",examples:[{"input":"board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"","output":"true"},{"input":"board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"","output":"true"}],constraints:["m == board.length","n = board[i].length","1 \u003c= m, n \u003c= 6","1 \u003c= word.length \u003c= 15","board and word consists of only lowercase and uppercase English letters."]},
"LC 108":{sourceUrl:"https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",examples:[{"input":"nums = [-10,-3,0,5,9]","output":"[0,-3,9,-10,null,5]","note":"[0,-10,5,null,-3,null,9] is also accepted:"},{"input":"nums = [1,3]","output":"[3,1]","note":"[1,null,3] and [3,1] are both height-balanced BSTs."}],constraints:["1 \u003c= nums.length \u003c= 10^4","-10^4 \u003c= nums[i] \u003c= 10^4","nums is sorted in a strictly increasing order."]},
"LC 148":{sourceUrl:"https://leetcode.com/problems/sort-list/",examples:[{"input":"head = [4,2,1,3]","output":"[1,2,3,4]"},{"input":"head = [-1,5,3,4,0]","output":"[-1,0,3,4,5]"}],constraints:["The number of nodes in the list is in the range [0, 5 * 10^4] .","-10^5 \u003c= Node.val \u003c= 10^5"]},
"LC 427":{sourceUrl:"https://leetcode.com/problems/construct-quad-tree/",examples:[{"input":"grid = [[0,1],[1,0]]","output":"[[0,1],[1,0],[1,1],[1,1],[1,0]]","note":"The explanation of this example is shown below: Notice that 0 represents False and 1 represents True in the photo representing the Quad-Tree."},{"input":"grid = [[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0]]","output":"[[0,1],[1,1],[0,1],[1,1],[1,0],null,null,null,null,[1,0],[1,0],[1,1],[1,1]]","note":"All values in the grid are not the same. We divide the grid into four sub-grids. The topLeft, bottomLeft and bottomRight each has the same value. The topRight have different values so we divide it into 4 sub-grids where each has the same value. Explanation is shown in the photo below:"}],constraints:["n == grid.length == grid[i].length","n == 2^x where 0 \u003c= x \u003c= 6"]},
"LC 23":{sourceUrl:"https://leetcode.com/problems/merge-k-sorted-lists/",examples:[{"input":"lists = [[1,4,5],[1,3,4],[2,6]]","output":"[1,1,2,3,4,4,5,6]","note":"The linked-lists are: [ 1->4->5, 1->3->4, 2->6 ] merging them into one sorted linked list: 1->1->2->3->4->4->5->6"},{"input":"lists = []","output":"[]"}],constraints:["k == lists.length","0 \u003c= k \u003c= 10^4","0 \u003c= lists[i].length \u003c= 500","-10^4 \u003c= lists[i][j] \u003c= 10^4","lists[i] is sorted in ascending order .","The sum of lists[i].length will not exceed 10^4 ."]},
"LC 918":{sourceUrl:"https://leetcode.com/problems/maximum-sum-circular-subarray/",examples:[{"input":"nums = [1,-2,3,-2]","output":"3","note":"Subarray [3] has maximum sum 3."},{"input":"nums = [5,-3,5]","output":"10","note":"Subarray [5,5] has maximum sum 5 + 5 = 10."}],constraints:["n == nums.length","1 \u003c= n \u003c= 3 * 10^4","-3 * 10^4 \u003c= nums[i] \u003c= 3 * 10^4"]},
"LC 74":{sourceUrl:"https://leetcode.com/problems/search-a-2d-matrix/",examples:[{"input":"matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3","output":"true"},{"input":"matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13","output":"false"}],constraints:["m == matrix.length","n == matrix[i].length","1 \u003c= m, n \u003c= 100","-10^4 \u003c= matrix[i][j], target \u003c= 10^4"]},
"LC 162":{sourceUrl:"https://leetcode.com/problems/find-peak-element/",examples:[{"input":"nums = [1,2,3,1]","output":"2","note":"3 is a peak element and your function should return the index number 2."},{"input":"nums = [1,2,1,3,5,6,4]","output":"5","note":"Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6."}],constraints:["1 \u003c= nums.length \u003c= 1000","-2^31 \u003c= nums[i] \u003c= 2^31 - 1","nums[i] != nums[i + 1] for all valid i ."]},
"LC 34":{sourceUrl:"https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",examples:[{"input":"nums = [5,7,7,8,8,10], target = 8","output":"[3,4]"},{"input":"nums = [5,7,7,8,8,10], target = 6","output":"[-1,-1]"}],constraints:["0 \u003c= nums.length \u003c= 10^5","-10^9 \u003c= nums[i] \u003c= 10^9","nums is a non-decreasing array.","-10^9 \u003c= target \u003c= 10^9"]},
"LC 153":{sourceUrl:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",examples:[{"input":"nums = [3,4,5,1,2]","output":"1","note":"The original array was [1,2,3,4,5] rotated 3 times."},{"input":"nums = [4,5,6,7,0,1,2]","output":"0","note":"The original array was [0,1,2,4,5,6,7] and it was rotated 4 times."}],constraints:["n == nums.length","1 \u003c= n \u003c= 5000","-5000 \u003c= nums[i] \u003c= 5000","All the integers of nums are unique .","nums is sorted and rotated between 1 and n times."]},
"LC 4":{sourceUrl:"https://leetcode.com/problems/median-of-two-sorted-arrays/",examples:[{"input":"nums1 = [1,3], nums2 = [2]","output":"2.00000","note":"merged array = [1,2,3] and median is 2."},{"input":"nums1 = [1,2], nums2 = [3,4]","output":"2.50000","note":"merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."}],constraints:["nums1.length == m","nums2.length == n","0 \u003c= m \u003c= 1000","0 \u003c= n \u003c= 1000","1 \u003c= m + n \u003c= 2000","-10^6 \u003c= nums1[i], nums2[i] \u003c= 10^6"]},
"LC 502":{sourceUrl:"https://leetcode.com/problems/ipo/",examples:[{"input":"k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]","output":"4","note":"Since your initial capital is 0, you can only start the project indexed 0. After finishing it you will obtain profit 1 and your capital becomes 1. With capital 1, you can either start the project indexed 1 or the project indexed 2. Since you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital. Therefore, output the final maximized capital, which is 0 + 1 + 3 = 4."},{"input":"k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]","output":"6"}],constraints:["1 \u003c= k \u003c= 10^5","0 \u003c= w \u003c= 10^9","n == profits.length","n == capital.length","1 \u003c= n \u003c= 10^5","0 \u003c= profits[i] \u003c= 10^4","0 \u003c= capital[i] \u003c= 10^9"]},
"LC 373":{sourceUrl:"https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",examples:[{"input":"nums1 = [1,7,11], nums2 = [2,4,6], k = 3","output":"[[1,2],[1,4],[1,6]]","note":"The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]"},{"input":"nums1 = [1,1,2], nums2 = [1,2,3], k = 2","output":"[[1,1],[1,1]]","note":"The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]"}],constraints:["1 \u003c= nums1.length, nums2.length \u003c= 10^5","-10^9 \u003c= nums1[i], nums2[i] \u003c= 10^9","nums1 and nums2 both are sorted in non-decreasing order .","1 \u003c= k \u003c= 10^4","k \u003c= nums1.length * nums2.length"]},
"LC 295":{sourceUrl:"https://leetcode.com/problems/find-median-from-data-stream/",examples:[{"input":"operations = [\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"], args = [[],[1],[2],[],[3],[]]","output":"[null,null,null,1.5,null,2.0]","note":"After adding 1 and 2, median is 1.5; after adding 3, median is 2.0."}],constraints:["-10^5 \u003c= num \u003c= 10^5","There will be at least one element in the data structure before calling findMedian .","At most 5 * 10^4 calls will be made to addNum and findMedian .","If all integer numbers from the stream are in the range [0, 100] , how would you optimize your solution?","If 99% of all integer numbers from the stream are in the range [0, 100] , how would you optimize your solution?"]},
"LC 67":{sourceUrl:"https://leetcode.com/problems/add-binary/",examples:[{"input":"a = \"11\", b = \"1\"","output":"\"100\""},{"input":"a = \"1010\", b = \"1011\"","output":"\"10101\""}],constraints:["1 \u003c= a.length, b.length \u003c= 10^4","a and b consist only of '0' or '1' characters.","Each string does not contain leading zeros except for the zero itself."]},
"LC 190":{sourceUrl:"https://leetcode.com/problems/reverse-bits/",examples:[{"input":"n = 43261596","output":"964176192","note":"00000010100101000001111010011100 reverses to 00111001011110000010100101000000."},{"input":"n = 2147483644","output":"1073741822","note":"01111111111111111111111111111100 reverses to 00111111111111111111111111111110."}],constraints:["0 \u003c= n \u003c= 2^31 - 2","n is even."]},
"LC 191":{sourceUrl:"https://leetcode.com/problems/number-of-1-bits/",examples:[{"input":"n = 11","output":"3","note":"Binary 1011 has three set bits."},{"input":"n = 128","output":"1","note":"Binary 10000000 has one set bit."},{"input":"n = 2147483645","output":"30","note":"Binary 1111111111111111111111111111101 has thirty set bits."}],constraints:["1 \u003c= n \u003c= 2^31 - 1"]},
"LC 136":{sourceUrl:"https://leetcode.com/problems/single-number/",examples:[{"input":"nums = [2,2,1]","output":"1"},{"input":"nums = [4,1,2,1,2]","output":"4"},{"input":"nums = [1]","output":"1"}],constraints:["1 \u003c= nums.length \u003c= 3 * 10^4","-3 * 10^4 \u003c= nums[i] \u003c= 3 * 10^4","Each element in the array appears twice except for one element which appears only once."]},
"LC 137":{sourceUrl:"https://leetcode.com/problems/single-number-ii/",examples:[{"input":"nums = [2,2,3,2]","output":"3"},{"input":"nums = [0,1,0,1,0,1,99]","output":"99"}],constraints:["1 \u003c= nums.length \u003c= 3 * 10^4","-2^31 \u003c= nums[i] \u003c= 2^31 - 1","Each element in nums appears exactly three times except for one element which appears once ."]},
"LC 201":{sourceUrl:"https://leetcode.com/problems/bitwise-and-of-numbers-range/",examples:[{"input":"left = 5, right = 7","output":"4"},{"input":"left = 0, right = 0","output":"0"}],constraints:["0 \u003c= left \u003c= right \u003c= 2^31 - 1"]},
"LC 9":{sourceUrl:"https://leetcode.com/problems/palindrome-number/",examples:[{"input":"x = 121","output":"true","note":"121 reads as 121 from left to right and from right to left."},{"input":"x = -121","output":"false","note":"From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."}],constraints:["-2^31 \u003c= x \u003c= 2^31 - 1"]},
"LC 172":{sourceUrl:"https://leetcode.com/problems/factorial-trailing-zeroes/",examples:[{"input":"n = 3","output":"0","note":"3! = 6, no trailing zero."},{"input":"n = 5","output":"1","note":"5! = 120, one trailing zero."}],constraints:["0 \u003c= n \u003c= 10^4"]},
"LC 50":{sourceUrl:"https://leetcode.com/problems/powx-n/",examples:[{"input":"x = 2.00000, n = 10","output":"1024.00000"},{"input":"x = 2.10000, n = 3","output":"9.26100"}],constraints:["-100.0 \u003c x \u003c 100.0","-2^31 \u003c= n \u003c= 2^31-1","n is an integer.","Either x is not zero or n > 0 .","-10^4 \u003c= x^n \u003c= 10^4"]},
"LC 149":{sourceUrl:"https://leetcode.com/problems/max-points-on-a-line/",examples:[{"input":"points = [[1,1],[2,2],[3,3]]","output":"3"},{"input":"points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]","output":"4"}],constraints:["1 \u003c= points.length \u003c= 300","points[i].length == 2","-10^4 \u003c= x i , y i \u003c= 10^4","All the points are unique ."]},
"LC 70":{sourceUrl:"https://leetcode.com/problems/climbing-stairs/",examples:[{"input":"n = 2","output":"2","note":"There are two ways to climb to the top. 1. 1 step + 1 step 2. 2 steps"},{"input":"n = 3","output":"3","note":"There are three ways to climb to the top. 1. 1 step + 1 step + 1 step 2. 1 step + 2 steps 3. 2 steps + 1 step"}],constraints:["1 \u003c= n \u003c= 45"]},
"LC 198":{sourceUrl:"https://leetcode.com/problems/house-robber/",examples:[{"input":"nums = [1,2,3,1]","output":"4","note":"Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."},{"input":"nums = [2,7,9,3,1]","output":"12","note":"Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12."}],constraints:["1 \u003c= nums.length \u003c= 100","0 \u003c= nums[i] \u003c= 400"]},
"LC 139":{sourceUrl:"https://leetcode.com/problems/word-break/",examples:[{"input":"s = \"leetcode\", wordDict = [\"leet\",\"code\"]","output":"true","note":"Return true because \"leetcode\" can be segmented as \"leet code\"."},{"input":"s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]","output":"true","note":"Return true because \"applepenapple\" can be segmented as \"apple pen apple\". Note that you are allowed to reuse a dictionary word."}],constraints:["1 \u003c= s.length \u003c= 300","1 \u003c= wordDict.length \u003c= 1000","1 \u003c= wordDict[i].length \u003c= 20","s and wordDict[i] consist of only lowercase English letters.","All the strings of wordDict are unique ."]},
"LC 322":{sourceUrl:"https://leetcode.com/problems/coin-change/",examples:[{"input":"coins = [1,2,5], amount = 11","output":"3","note":"11 = 5 + 5 + 1"},{"input":"coins = [2], amount = 3","output":"-1"}],constraints:["1 \u003c= coins.length \u003c= 12","1 \u003c= coins[i] \u003c= 2^31 - 1","0 \u003c= amount \u003c= 10^4"]},
"LC 300":{sourceUrl:"https://leetcode.com/problems/longest-increasing-subsequence/",examples:[{"input":"nums = [10,9,2,5,3,7,101,18]","output":"4","note":"The longest increasing subsequence is [2,3,7,101], therefore the length is 4."},{"input":"nums = [0,1,0,3,2,3]","output":"4"}],constraints:["1 \u003c= nums.length \u003c= 2500","-10^4 \u003c= nums[i] \u003c= 10^4"]},
"LC 120":{sourceUrl:"https://leetcode.com/problems/triangle/",examples:[{"input":"triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]","output":"11","note":"The triangle looks like: 2 3 4 6 5 7 4 1 8 3 The minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11 (underlined above)."},{"input":"triangle = [[-10]]","output":"-10"}],constraints:["1 \u003c= triangle.length \u003c= 200","triangle[0].length == 1","triangle[i].length == triangle[i - 1].length + 1","-10^4 \u003c= triangle[i][j] \u003c= 10^4"]},
"LC 64":{sourceUrl:"https://leetcode.com/problems/minimum-path-sum/",examples:[{"input":"grid = [[1,3,1],[1,5,1],[4,2,1]]","output":"7","note":"Because the path 1 &rarr; 3 &rarr; 1 &rarr; 1 &rarr; 1 minimizes the sum."},{"input":"grid = [[1,2,3],[4,5,6]]","output":"12"}],constraints:["m == grid.length","n == grid[i].length","1 \u003c= m, n \u003c= 200","0 \u003c= grid[i][j] \u003c= 200"]},
"LC 63":{sourceUrl:"https://leetcode.com/problems/unique-paths-ii/",examples:[{"input":"obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]","output":"2","note":"There is one obstacle in the middle of the 3x3 grid above. There are two ways to reach the bottom-right corner: 1. Right -> Right -> Down -> Down 2. Down -> Down -> Right -> Right"},{"input":"obstacleGrid = [[0,1],[0,0]]","output":"1"}],constraints:["m == obstacleGrid.length","n == obstacleGrid[i].length","1 \u003c= m, n \u003c= 100","obstacleGrid[i][j] is 0 or 1 ."]},
"LC 5":{sourceUrl:"https://leetcode.com/problems/longest-palindromic-substring/",examples:[{"input":"s = \"babad\"","output":"\"bab\"","note":"\"aba\" is also a valid answer."},{"input":"s = \"cbbd\"","output":"\"bb\""}],constraints:["1 \u003c= s.length \u003c= 1000","s consist of only digits and English letters."]},
"LC 97":{sourceUrl:"https://leetcode.com/problems/interleaving-string/",examples:[{"input":"s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"","output":"true","note":"One way to obtain s3 is: Split s1 into s1 = \"aa\" + \"bc\" + \"c\", and s2 into s2 = \"dbbc\" + \"a\". Interleaving the two splits, we get \"aa\" + \"dbbc\" + \"bc\" + \"a\" + \"c\" = \"aadbbcbcac\". Since s3 can be obtained by interleaving s1 and s2, we return true."},{"input":"s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"","output":"false","note":"Notice how it is impossible to interleave s2 with any other string to obtain s3."}],constraints:["0 \u003c= s1.length, s2.length \u003c= 100","0 \u003c= s3.length \u003c= 200","s1 , s2 , and s3 consist of lowercase English letters."]},
"LC 72":{sourceUrl:"https://leetcode.com/problems/edit-distance/",examples:[{"input":"word1 = \"horse\", word2 = \"ros\"","output":"3","note":"horse -> rorse (replace 'h' with 'r') rorse -> rose (remove 'r') rose -> ros (remove 'e')"},{"input":"word1 = \"intention\", word2 = \"execution\"","output":"5","note":"intention -> inention (remove 't') inention -> enention (replace 'i' with 'e') enention -> exention (replace 'n' with 'x') exention -> exection (replace 'n' with 'c') exection -> execution (insert 'u')"}],constraints:["0 \u003c= word1.length, word2.length \u003c= 500","word1 and word2 consist of lowercase English letters."]},
"LC 123":{sourceUrl:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",examples:[{"input":"prices = [3,3,5,0,0,3,1,4]","output":"6","note":"Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3. Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3."},{"input":"prices = [1,2,3,4,5]","output":"4","note":"Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4. Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again."}],constraints:["1 \u003c= prices.length \u003c= 10^5","0 \u003c= prices[i] \u003c= 10^5"]},
"LC 188":{sourceUrl:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",examples:[{"input":"k = 2, prices = [2,4,1]","output":"2","note":"Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2."},{"input":"k = 2, prices = [3,2,6,5,0,3]","output":"7","note":"Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3."}],constraints:["1 \u003c= k \u003c= 100","1 \u003c= prices.length \u003c= 1000","0 \u003c= prices[i] \u003c= 1000"]},
"LC 221":{sourceUrl:"https://leetcode.com/problems/maximal-square/",examples:[{"input":"matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]","output":"4"},{"input":"matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]","output":"1"}],constraints:["m == matrix.length","n == matrix[i].length","1 \u003c= m, n \u003c= 300","matrix[i][j] is '0' or '1' ."]}
});

Object.assign(studyMeta,{
"LC 88":{sourceUrl:"https://leetcode.com/problems/merge-sorted-array/",examples:[{input:"nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",output:"[1,2,2,3,5,6]"},{input:"nums1 = [1], m = 1, nums2 = [], n = 0",output:"[1]"}],constraints:["nums1.length == m + n","nums2.length == n","0 <= m, n <= 200","1 <= m + n <= 200","-10^9 <= nums1[i], nums2[j] <= 10^9"]},
"LC 27":{sourceUrl:"https://leetcode.com/problems/remove-element/",examples:[{input:"nums = [3,2,2,3], val = 3",output:"2, nums = [2,2,_,_]"},{input:"nums = [0,1,2,2,3,0,4,2], val = 2",output:"5, nums = [0,1,4,0,3,_,_,_]"}],constraints:["0 <= nums.length <= 100","0 <= nums[i] <= 50","0 <= val <= 100"]},
"LC 26":{sourceUrl:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/",examples:[{input:"nums = [1,1,2]",output:"2, nums = [1,2,_]"},{input:"nums = [0,0,1,1,1,2,2,3,3,4]",output:"5, nums = [0,1,2,3,4,_,_,_,_,_]"}],constraints:["1 <= nums.length <= 3 * 10^4","-100 <= nums[i] <= 100","nums is sorted in nondecreasing order."]},
"LC 80":{sourceUrl:"https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",examples:[{input:"nums = [1,1,1,2,2,3]",output:"5, nums = [1,1,2,2,3,_]"},{input:"nums = [0,0,1,1,1,1,2,3,3]",output:"7, nums = [0,0,1,1,2,3,3,_,_]"}],constraints:["1 <= nums.length <= 3 * 10^4","-10^4 <= nums[i] <= 10^4","nums is sorted in nondecreasing order."]},
"LC 169":{sourceUrl:"https://leetcode.com/problems/majority-element/",examples:[{input:"nums = [3,2,3]",output:"3"},{input:"nums = [2,2,1,1,1,2,2]",output:"2"}],constraints:["1 <= nums.length <= 5 * 10^4","-10^9 <= nums[i] <= 10^9","The majority element always exists."]},
"LC 189":{sourceUrl:"https://leetcode.com/problems/rotate-array/",examples:[{input:"nums = [1,2,3,4,5,6,7], k = 3",output:"[5,6,7,1,2,3,4]"},{input:"nums = [-1,-100,3,99], k = 2",output:"[3,99,-1,-100]"}],constraints:["1 <= nums.length <= 10^5","-2^31 <= nums[i] <= 2^31 - 1","0 <= k <= 10^5"]},
"LC 55":{sourceUrl:"https://leetcode.com/problems/jump-game/",examples:[{input:"nums = [2,3,1,1,4]",output:"true"},{input:"nums = [3,2,1,0,4]",output:"false"}],constraints:["1 <= nums.length <= 10^4","0 <= nums[i] <= 10^5"]},
"LC 45":{sourceUrl:"https://leetcode.com/problems/jump-game-ii/",examples:[{input:"nums = [2,3,1,1,4]",output:"2"},{input:"nums = [2,3,0,1,4]",output:"2"}],constraints:["1 <= nums.length <= 10^4","0 <= nums[i] <= 1000","The last index is always reachable."]},
"LC 274":{sourceUrl:"https://leetcode.com/problems/h-index/",examples:[{input:"citations = [3,0,6,1,5]",output:"3"},{input:"citations = [1,3,1]",output:"1"}],constraints:["1 <= citations.length <= 5000","0 <= citations[i] <= 1000"]},
"LC 380":{sourceUrl:"https://leetcode.com/problems/insert-delete-getrandom-o1/",examples:[{input:'operations = ["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"], args = [[],[1],[2],[2],[],[1],[2],[]]',output:"[null,true,false,true,2,true,false,2]",note:"getRandom returns a random existing element."}],constraints:["-2^31 <= val <= 2^31 - 1","At most 2 * 10^5 calls will be made.","getRandom is called only when at least one element exists.","Each function must run in average O(1) time."]},
"LC 134":{sourceUrl:"https://leetcode.com/problems/gas-station/",examples:[{input:"gas = [1,2,3,4,5], cost = [3,4,5,1,2]",output:"3"},{input:"gas = [2,3,4], cost = [3,4,3]",output:"-1"}],constraints:["gas.length == cost.length","1 <= gas.length <= 10^5","0 <= gas[i], cost[i] <= 10^4"]},
"LC 42":{sourceUrl:"https://leetcode.com/problems/trapping-rain-water/",examples:[{input:"height = [0,1,0,2,1,0,1,3,2,1,2,1]",output:"6"},{input:"height = [4,2,0,3,2,5]",output:"9"}],constraints:["1 <= height.length <= 2 * 10^4","0 <= height[i] <= 10^5"]},
"LC 13":{sourceUrl:"https://leetcode.com/problems/roman-to-integer/",examples:[{input:'s = "III"',output:"3"},{input:'s = "MCMXCIV"',output:"1994"}],constraints:["1 <= s.length <= 15","s contains only I, V, X, L, C, D, and M.","The input is a valid Roman numeral in the range [1, 3999]."]},
"LC 12":{sourceUrl:"https://leetcode.com/problems/integer-to-roman/",examples:[{input:"num = 3749",output:'"MMMDCCXLIX"'},{input:"num = 58",output:'"LVIII"'}],constraints:["1 <= num <= 3999"]},
"LC 58":{sourceUrl:"https://leetcode.com/problems/length-of-last-word/",examples:[{input:'s = "Hello World"',output:"5"},{input:'s = "   fly me   to   the moon  "',output:"4"}],constraints:["1 <= s.length <= 10^4","s consists of English letters and spaces.","There will be at least one word."]},
"LC 14":{sourceUrl:"https://leetcode.com/problems/longest-common-prefix/",examples:[{input:'strs = ["flower","flow","flight"]',output:'"fl"'},{input:'strs = ["dog","racecar","car"]',output:'""'}],constraints:["1 <= strs.length <= 200","0 <= strs[i].length <= 200","strs[i] contains lowercase English letters when non-empty."]},
"LC 151":{sourceUrl:"https://leetcode.com/problems/reverse-words-in-a-string/",examples:[{input:'s = "the sky is blue"',output:'"blue is sky the"'},{input:'s = "  hello world  "',output:'"world hello"'}],constraints:["1 <= s.length <= 10^4","s contains English letters, digits, and spaces.","There is at least one word."]},
"LC 6":{sourceUrl:"https://leetcode.com/problems/zigzag-conversion/",examples:[{input:'s = "PAYPALISHIRING", numRows = 3',output:'"PAHNAPLSIIGYIR"',note:"Rows become PAHN / APLSIIG / YIR, then concatenate them."},{input:'s = "PAYPALISHIRING", numRows = 4',output:'"PINALSIGYAHRPI"',note:"Rows become PIN / ALSIG / YAHR / PI, then concatenate them."}],constraints:["1 <= s.length <= 1000","s contains English letters, comma, and period.","1 <= numRows <= 1000"]},
"LC 28":{sourceUrl:"https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",examples:[{input:'haystack = "sadbutsad", needle = "sad"',output:"0"},{input:'haystack = "leetcode", needle = "leeto"',output:"-1"}],constraints:["1 <= haystack.length, needle.length <= 10^4","haystack and needle contain lowercase English letters."]},
"LC 383":{sourceUrl:"https://leetcode.com/problems/ransom-note/",examples:[{input:'ransomNote = "a", magazine = "b"',output:"false"},{input:'ransomNote = "aa", magazine = "aab"',output:"true"}],constraints:["1 <= ransomNote.length, magazine.length <= 10^5","ransomNote and magazine consist of lowercase English letters."]},
"LC 205":{sourceUrl:"https://leetcode.com/problems/isomorphic-strings/",examples:[{input:'s = "egg", t = "add"',output:"true"},{input:'s = "foo", t = "bar"',output:"false"}],constraints:["1 <= s.length <= 5 * 10^4","t.length == s.length","s and t consist of valid ASCII characters."]},
"LC 290":{sourceUrl:"https://leetcode.com/problems/word-pattern/",examples:[{input:'pattern = "abba", s = "dog cat cat dog"',output:"true"},{input:'pattern = "abba", s = "dog cat cat fish"',output:"false"}],constraints:["1 <= pattern.length <= 300","pattern contains lowercase English letters.","1 <= s.length <= 3000","s contains lowercase English letters and spaces."]},
"LC 202":{sourceUrl:"https://leetcode.com/problems/happy-number/",examples:[{input:"n = 19",output:"true"},{input:"n = 2",output:"false"}],constraints:["1 <= n <= 2^31 - 1"]},
"LC 66":{sourceUrl:"https://leetcode.com/problems/plus-one/",examples:[{input:"digits = [1,2,3]",output:"[1,2,4]"},{input:"digits = [9]",output:"[1,0]"}],constraints:["1 <= digits.length <= 100","0 <= digits[i] <= 9","digits does not contain leading zeroes except the number 0 itself."]},
"LC 69":{sourceUrl:"https://leetcode.com/problems/sqrtx/",examples:[{input:"x = 4",output:"2"},{input:"x = 8",output:"2",note:"The square root is 2.828..., so return 2."}],constraints:["0 <= x <= 2^31 - 1"]},
"LC 135":{sourceUrl:"https://leetcode.com/problems/candy/",examples:[{input:"ratings = [1,0,2]",output:"5"},{input:"ratings = [1,2,2]",output:"4"}],constraints:["1 <= ratings.length <= 2 * 10^4","0 <= ratings[i] <= 2 * 10^4"]},
"LC 68":{sourceUrl:"https://leetcode.com/problems/text-justification/",examples:[{input:'words = ["This","is","an","example","of","text","justification."], maxWidth = 16',output:'["This    is    an","example  of text","justification.  "]'},{input:'words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16',output:'["What   must   be","acknowledgment  ","shall be        "]'}],constraints:["1 <= words.length <= 300","1 <= words[i].length <= 20","words[i] contains only English letters and symbols.","1 <= maxWidth <= 100","words[i].length <= maxWidth"]}
});
Object.assign(studyMeta,{
"LC 53":{...studyMeta["LC 53"],leetcodeFollowUp:"If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle."},
"LC 76":{...studyMeta["LC 76"],leetcodeFollowUp:"Could you find an algorithm that runs in O(m + n) time?"},
"LC 238":{...studyMeta["LC 238"],leetcodeFollowUp:"Can you solve the problem in O(1) extra space complexity? The output array does not count as extra space."},
"LC 242":{...studyMeta["LC 242"],leetcodeFollowUp:"What if the inputs contain Unicode characters? How would you adapt your solution to such a case?"},
"LC 347":{...studyMeta["LC 347"],leetcodeFollowUp:"The algorithm's time complexity must be better than O(n log n), where n is the array size."},
"LC 88":{...studyMeta["LC 88"],leetcodeFollowUp:"Can you come up with an algorithm that runs in O(m + n) time?"},
"LC 35":{sourceUrl:"https://leetcode.com/problems/search-insert-position/",examples:[{input:"nums = [1,3,5,6], target = 5",output:"2"},{input:"nums = [1,3,5,6], target = 2",output:"1"},{input:"nums = [1,3,5,6], target = 7",output:"4"}],constraints:["1 <= nums.length <= 10^4","-10^4 <= nums[i], target <= 10^4","nums contains distinct values sorted in ascending order."]},
"LC 56":{sourceUrl:"https://leetcode.com/problems/merge-intervals/",examples:[{input:"intervals = [[1,3],[2,6],[8,10],[15,18]]",output:"[[1,6],[8,10],[15,18]]"},{input:"intervals = [[1,4],[4,5]]",output:"[[1,5]]"}],constraints:["1 <= intervals.length <= 10^4","intervals[i].length == 2","0 <= starti <= endi <= 10^4"]},
"LC 57":{sourceUrl:"https://leetcode.com/problems/insert-interval/",examples:[{input:"intervals = [[1,3],[6,9]], newInterval = [2,5]",output:"[[1,5],[6,9]]"},{input:"intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",output:"[[1,2],[3,10],[12,16]]"}],constraints:["0 <= intervals.length <= 10^4","intervals[i].length == 2","intervals is sorted by start and non-overlapping.","newInterval.length == 2"]},
"LC 155":{sourceUrl:"https://leetcode.com/problems/min-stack/",examples:[{input:'operations = ["MinStack","push","push","push","getMin","pop","top","getMin"], args = [[],[-2],[0],[-3],[],[],[],[]]',output:"[null,null,null,null,-3,null,0,-2]"}],constraints:["-2^31 <= val <= 2^31 - 1","pop, top, and getMin are called only on non-empty stacks.","At most 3 * 10^4 calls will be made.","All operations must run in O(1) time."]},
"LC 150":{sourceUrl:"https://leetcode.com/problems/evaluate-reverse-polish-notation/",examples:[{input:'tokens = ["2","1","+","3","*"]',output:"9"},{input:'tokens = ["4","13","5","/","+"]',output:"6"},{input:'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',output:"22"}],constraints:["1 <= tokens.length <= 10^4","tokens[i] is an operator or an integer in range [-200, 200].","Division between two integers truncates toward zero.","The input represents a valid arithmetic expression."]},
"LC 141":{sourceUrl:"https://leetcode.com/problems/linked-list-cycle/",examples:[{input:"head = [3,2,0,-4], pos = 1",output:"true"},{input:"head = [1,2], pos = 0",output:"true"},{input:"head = [1], pos = -1",output:"false"}],constraints:["0 <= number of nodes <= 10^4","-10^5 <= Node.val <= 10^5","pos is -1 or a valid index in the linked list."]},
"LC 2":{sourceUrl:"https://leetcode.com/problems/add-two-numbers/",examples:[{input:"l1 = [2,4,3], l2 = [5,6,4]",output:"[7,0,8]",note:"342 + 465 = 807."},{input:"l1 = [0], l2 = [0]",output:"[0]"},{input:"l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",output:"[8,9,9,9,0,0,0,1]"}],constraints:["The number of nodes in each list is in [1, 100].","0 <= Node.val <= 9","The lists represent numbers without leading zeroes except zero itself."]},
"LC 104":{sourceUrl:"https://leetcode.com/problems/maximum-depth-of-binary-tree/",examples:[{input:"root = [3,9,20,null,null,15,7]",output:"3"},{input:"root = [1,null,2]",output:"2"}],constraints:["0 <= number of nodes <= 10^4","-100 <= Node.val <= 100"]},
"LC 199":{sourceUrl:"https://leetcode.com/problems/binary-tree-right-side-view/",examples:[{input:"root = [1,2,3,null,5,null,4]",output:"[1,3,4]"},{input:"root = [1,null,3]",output:"[1,3]"},{input:"root = []",output:"[]"}],constraints:["0 <= number of nodes <= 100","-100 <= Node.val <= 100"]},
"LC 208":{sourceUrl:"https://leetcode.com/problems/implement-trie-prefix-tree/",examples:[{input:'operations = ["Trie","insert","search","search","startsWith","insert","search"], args = [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',output:"[null,null,true,false,true,null,true]"}],constraints:["1 <= word.length, prefix.length <= 2000","word and prefix consist only of lowercase English letters.","At most 3 * 10^4 calls will be made."]}
});
Object.assign(studyMeta,{
"LC 167":{sourceUrl:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",examples:[{input:"numbers = [2,7,11,15], target = 9",output:"[1,2]"},{input:"numbers = [2,3,4], target = 6",output:"[1,3]"}],constraints:["2 <= numbers.length <= 3 * 10^4","numbers is sorted in non-decreasing order.","Exactly one solution exists."]},
"LC 209":{sourceUrl:"https://leetcode.com/problems/minimum-size-subarray-sum/",examples:[{input:"target = 7, nums = [2,3,1,2,4,3]",output:"2"},{input:"target = 4, nums = [1,4,4]",output:"1"}],constraints:["1 <= target <= 10^9","1 <= nums.length <= 10^5","1 <= nums[i] <= 10^4"]},
"LC 219":{sourceUrl:"https://leetcode.com/problems/contains-duplicate-ii/",examples:[{input:"nums = [1,2,3,1], k = 3",output:"true"},{input:"nums = [1,0,1,1], k = 1",output:"true"},{input:"nums = [1,2,3,1,2,3], k = 2",output:"false"}],constraints:["1 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9","0 <= k <= 10^5"]},
"LC 228":{sourceUrl:"https://leetcode.com/problems/summary-ranges/",examples:[{input:"nums = [0,1,2,4,5,7]",output:'["0->2","4->5","7"]'},{input:"nums = [0,2,3,4,6,8,9]",output:'["0","2->4","6","8->9"]'}],constraints:["0 <= nums.length <= 20","-2^31 <= nums[i] <= 2^31 - 1","nums is sorted and unique."]},
"LC 452":{sourceUrl:"https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",examples:[{input:"points = [[10,16],[2,8],[1,6],[7,12]]",output:"2"},{input:"points = [[1,2],[3,4],[5,6],[7,8]]",output:"4"}],constraints:["1 <= points.length <= 10^5","points[i].length == 2","-2^31 <= xstart < xend <= 2^31 - 1"]},
"LC 71":{sourceUrl:"https://leetcode.com/problems/simplify-path/",examples:[{input:'path = "/home/"',output:'"/home"'},{input:'path = "/../"',output:'"/"'},{input:'path = "/home//foo/"',output:'"/home/foo"'}],constraints:["1 <= path.length <= 3000","path consists of English letters, digits, '.', '/', or '_'.","path is a valid absolute Unix path."]},
"LC 21":{sourceUrl:"https://leetcode.com/problems/merge-two-sorted-lists/",examples:[{input:"list1 = [1,2,4], list2 = [1,3,4]",output:"[1,1,2,3,4,4]"},{input:"list1 = [], list2 = []",output:"[]"},{input:"list1 = [], list2 = [0]",output:"[0]"}],constraints:["0 <= number of nodes <= 50","-100 <= Node.val <= 100","Both lists are sorted in non-decreasing order."]},
"LC 19":{sourceUrl:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",examples:[{input:"head = [1,2,3,4,5], n = 2",output:"[1,2,3,5]"},{input:"head = [1], n = 1",output:"[]"},{input:"head = [1,2], n = 1",output:"[1]"}],constraints:["1 <= number of nodes <= 30","1 <= Node.val <= 100","1 <= n <= list length"]},
"LC 100":{sourceUrl:"https://leetcode.com/problems/same-tree/",examples:[{input:"p = [1,2,3], q = [1,2,3]",output:"true"},{input:"p = [1,2], q = [1,null,2]",output:"false"}],constraints:["0 <= number of nodes <= 100","-10^4 <= Node.val <= 10^4"]},
"LC 101":{sourceUrl:"https://leetcode.com/problems/symmetric-tree/",examples:[{input:"root = [1,2,2,3,4,4,3]",output:"true"},{input:"root = [1,2,2,null,3,null,3]",output:"false"}],constraints:["1 <= number of nodes <= 1000","-100 <= Node.val <= 100"]},
"LC 112":{sourceUrl:"https://leetcode.com/problems/path-sum/",examples:[{input:"root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",output:"true"},{input:"root = [1,2,3], targetSum = 5",output:"false"}],constraints:["0 <= number of nodes <= 5000","-1000 <= Node.val <= 1000","-1000 <= targetSum <= 1000"]},
"LC 129":{sourceUrl:"https://leetcode.com/problems/sum-root-to-leaf-numbers/",examples:[{input:"root = [1,2,3]",output:"25",note:"12 + 13 = 25."},{input:"root = [4,9,0,5,1]",output:"1026"}],constraints:["1 <= number of nodes <= 1000","0 <= Node.val <= 9","Tree depth is at most 10."]},
"LC 105":{sourceUrl:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",examples:[{input:"preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",output:"[3,9,20,null,null,15,7]"},{input:"preorder = [-1], inorder = [-1]",output:"[-1]"}],constraints:["1 <= preorder.length <= 3000","preorder.length == inorder.length","All values are unique."]},
"LC 230":{sourceUrl:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/",examples:[{input:"root = [3,1,4,null,2], k = 1",output:"1"},{input:"root = [5,3,6,2,4,null,null,1], k = 3",output:"3"}],constraints:["1 <= k <= number of nodes <= 10^4","0 <= Node.val <= 10^4"]},
"LC 236":{sourceUrl:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",examples:[{input:"root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",output:"3"},{input:"root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",output:"5"}],constraints:["2 <= number of nodes <= 10^5","-10^9 <= Node.val <= 10^9","p and q exist in the tree and are distinct."]},
"LC 433":{sourceUrl:"https://leetcode.com/problems/minimum-genetic-mutation/",examples:[{input:'startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]',output:"1"},{input:'startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]',output:"2"}],constraints:["startGene.length == endGene.length == 8","0 <= bank.length <= 10","Genes contain only A, C, G, and T."]},
"LC 127":{sourceUrl:"https://leetcode.com/problems/word-ladder/",examples:[{input:'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',output:"5"},{input:'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',output:"0"}],constraints:["1 <= word.length <= 10","1 <= wordList.length <= 5000","All words have the same length."]},
"LC 211":{sourceUrl:"https://leetcode.com/problems/design-add-and-search-words-data-structure/",examples:[{input:'operations = ["WordDictionary","addWord","addWord","addWord","search","search","search","search"], args = [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',output:"[null,null,null,null,false,true,true,true]"}],constraints:["1 <= word.length <= 25","word in addWord consists of lowercase English letters.","word in search may contain '.' wildcard.","At most 10^4 calls will be made."]},
"LC 22":{sourceUrl:"https://leetcode.com/problems/generate-parentheses/",examples:[{input:"n = 3",output:'["((()))","(()())","(())()","()(())","()()()"]'},{input:"n = 1",output:'["()"]'}],constraints:["1 <= n <= 8"]},
"LC 133":{sourceUrl:"https://leetcode.com/problems/clone-graph/",examples:[{input:"adjList = [[2,4],[1,3],[2,4],[1,3]]",output:"[[2,4],[1,3],[2,4],[1,3]]"},{input:"adjList = [[]]",output:"[[]]"},{input:"adjList = []",output:"[]"}],constraints:["0 <= number of nodes <= 100","1 <= Node.val <= 100","Node.val is unique for each node.","The graph is connected and undirected."]}
});

const officialLc150Ids=["LC 88","LC 27","LC 26","LC 80","LC 169","LC 189","LC 121","LC 122","LC 55","LC 45","LC 274","LC 380","LC 238","LC 134","LC 135","LC 42","LC 13","LC 12","LC 58","LC 14","LC 151","LC 6","LC 28","LC 68","LC 125","LC 392","LC 167","LC 11","LC 15","LC 209","LC 3","LC 30","LC 76","LC 36","LC 54","LC 48","LC 73","LC 289","LC 383","LC 205","LC 290","LC 242","LC 49","LC 1","LC 202","LC 219","LC 128","LC 228","LC 56","LC 57","LC 452","LC 20","LC 71","LC 155","LC 150","LC 224","LC 141","LC 2","LC 21","LC 138","LC 92","LC 25","LC 19","LC 82","LC 61","LC 86","LC 146","LC 104","LC 100","LC 226","LC 101","LC 105","LC 106","LC 117","LC 114","LC 112","LC 129","LC 124","LC 173","LC 222","LC 236","LC 199","LC 637","LC 102","LC 103","LC 530","LC 230","LC 98","LC 200","LC 130","LC 133","LC 399","LC 207","LC 210","LC 909","LC 433","LC 127","LC 208","LC 211","LC 212","LC 17","LC 77","LC 46","LC 39","LC 52","LC 22","LC 79","LC 108","LC 148","LC 427","LC 23","LC 53","LC 918","LC 35","LC 74","LC 162","LC 33","LC 34","LC 153","LC 4","LC 215","LC 502","LC 373","LC 295","LC 67","LC 190","LC 191","LC 136","LC 137","LC 201","LC 9","LC 66","LC 172","LC 69","LC 50","LC 149","LC 70","LC 198","LC 139","LC 322","LC 300","LC 120","LC 64","LC 63","LC 5","LC 97","LC 72","LC 123","LC 188","LC 221"];
const solidSolutionPatches={
"LC 70":{signal:"Counting ways to climb 1 or 2 steps is Fibonacci-style 1D DP.",hints:["Let ways[i] be the number of ways to reach step i.","The last move to i came from i-1 or i-2.","So ways[i] = ways[i-1] + ways[i-2].","Compress to two variables because only the previous two states matter."],interviewer:["What is the DP state?","Why does Fibonacci appear here?","Can you reduce space?","What happens for n = 1 or n = 2?"],answer:["Use two variables for ways to reach the previous two steps.","For each step from 3 to n, add the previous two counts.","Shift the variables forward.","Return the count for n."],complexity:"O(n) time, O(1) space",code:`int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1;
    int prev1 = 2;
    for (int step = 3; step <= n; ++step) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,followups:["Can you write it as matrix exponentiation?","What if steps can be 1, 2, or 3?","What if some steps are blocked?"],review:"Climbing Stairs is Fibonacci DP: current ways equals previous one plus previous two."},
"LC 198":{signal:"Cannot take adjacent houses -> DP with take/skip state.",hints:["At each house, choose rob it or skip it.","If you rob current, add nums[i] to the best before the previous house.","If you skip current, keep the previous best.","Only two previous values are needed."],interviewer:["What is the DP state?","Why can adjacent houses not both be used?","Can you do O(1) space?","What edge cases matter?"],answer:["Let prev2 be best up to i-2 and prev1 be best up to i-1.","For each house, current best is max(prev1, prev2 + nums[i]).","Shift prev2 and prev1 forward.","Return prev1."],complexity:"O(n) time, O(1) space",code:`int rob(vector<int>& nums) {
    int prev2 = 0;
    int prev1 = 0;
    for (int money : nums) {
        int cur = max(prev1, prev2 + money);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,followups:["What if houses are circular?","Can you reconstruct which houses were robbed?","What if negative values are allowed?"],review:"House Robber is take/skip DP; taking current depends on the best answer two houses back."},
"LC 392":{signal:"Subsequence check means scan both strings with two pointers.",hints:["Pointer i tracks how much of s has been matched.","Pointer j scans t from left to right.","When s[i] == t[j], consume that character of s.","At the end, s is a subsequence only if all of s was consumed."],interviewer:["What do the two pointers represent?","What if s is empty?","What if we check many s strings against the same t?","What is the complexity?"],answer:["Use i for s and j for t.","Scan t once.","When characters match, increment i.","Return whether i reached s.size()."],complexity:"O(|t|) time, O(1) space",code:`bool isSubsequence(string s, string t) {
    int i = 0;
    for (char c : t) {
        if (i < s.size() && s[i] == c) ++i;
    }
    return i == s.size();
}`,followups:["What if there are many incoming s queries?","Can you preprocess t?","What if strings are very long streams?"],review:"Is Subsequence is a one-pass two-pointer match; consume s only when t provides the next needed character."},
"LC 122":{signal:"Unlimited transactions means every positive day-to-day gain can be captured.",hints:["You can buy and sell multiple times, but cannot hold multiple shares.","Any increasing run can be split into daily gains without changing total profit.","Add prices[i] - prices[i-1] whenever it is positive.","This is greedy because local positive gains compose into the global optimum."],interviewer:["Why is greedy valid?","Can you hold multiple stocks?","What if prices only decrease?","How would fees change it?"],answer:["Initialize profit to zero.","For each adjacent pair, if today's price is higher than yesterday's, add the difference.","Ignore non-positive differences.","Return total profit."],complexity:"O(n) time, O(1) space",code:`int maxProfit(vector<int>& prices) {
    int profit = 0;
    for (int i = 1; i < prices.size(); ++i) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
}`,followups:["What if there is a transaction fee?","What if there is a cooldown day?","What if only k transactions are allowed?"],review:"For unlimited stock transactions, sum every positive adjacent price difference."},
"LC 36":{signal:"Sudoku validity is duplicate detection across rows, columns, and 3x3 boxes.",hints:["Only filled cells matter; skip '.'.","Each digit must be unique in its row.","Each digit must be unique in its column.","Each digit must be unique in its 3x3 box."],interviewer:["How do you map a cell to its box?","Do empty cells count?","Is the board always 9x9?","What is the space complexity?"],answer:["Use three 9x9 boolean tables for rows, columns, and boxes.","For each filled cell, compute digit index and box index.","If any table already contains that digit, return false.","Mark all three tables and continue."],complexity:"O(81) time, O(1) space",code:`bool isValidSudoku(vector<vector<char>>& board) {
    bool row[9][9] = {};
    bool col[9][9] = {};
    bool box[9][9] = {};

    for (int r = 0; r < 9; ++r) {
        for (int c = 0; c < 9; ++c) {
            if (board[r][c] == '.') continue;
            int d = board[r][c] - '1';
            int b = (r / 3) * 3 + (c / 3);
            if (row[r][d] || col[c][d] || box[b][d]) return false;
            row[r][d] = col[c][d] = box[b][d] = true;
        }
    }
    return true;
}`,followups:["Can you use bit masks instead of bool arrays?","How would this change for a different board size?","Does this require solving the Sudoku?"],review:"Valid Sudoku is three duplicate checks: row, column, and 3x3 box."},
"LC 54":{signal:"Spiral order means maintaining shrinking top/bottom/left/right boundaries.",hints:["Use four boundaries: top, bottom, left, right.","Traverse top row, right column, bottom row, left column.","After each direction, shrink that boundary.","Check boundaries before traversing bottom row or left column."],interviewer:["What are the boundaries?","Why do we need boundary checks after shrinking?","What about one row or one column?","What is the complexity?"],answer:["Initialize top, bottom, left, and right.","Loop while top <= bottom and left <= right.","Traverse the four sides in order, shrinking after each side.","Guard bottom and left traversals because the matrix may collapse."],complexity:"O(mn) time, O(1) extra space",code:`vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> ans;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;

    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; ++c) ans.push_back(matrix[top][c]);
        ++top;

        for (int r = top; r <= bottom; ++r) ans.push_back(matrix[r][right]);
        --right;

        if (top <= bottom) {
            for (int c = right; c >= left; --c) ans.push_back(matrix[bottom][c]);
            --bottom;
        }

        if (left <= right) {
            for (int r = bottom; r >= top; --r) ans.push_back(matrix[r][left]);
            ++left;
        }
    }
    return ans;
}`,followups:["Can you do it with direction vectors and visited?","How do single-row cases behave?","Can you stream the output?"],review:"Spiral Matrix is boundary simulation; shrink one side after completing that side."},
"LC 48":{signal:"Rotate image in-place can be done by transpose then reverse each row.",hints:["A 90-degree clockwise rotation maps (r,c) to (c,n-1-r).","Transpose swaps matrix[r][c] with matrix[c][r].","Reversing each row after transpose completes the clockwise rotation.","Do not allocate another matrix because the problem asks in-place."],interviewer:["Why transpose plus reverse works?","Can you rotate counter-clockwise?","What is the space complexity?","What if the matrix is not square?"],answer:["Transpose the square matrix across its main diagonal.","Reverse every row.","The composition maps each original cell to its clockwise-rotated position.","Use O(1) extra space."],complexity:"O(n^2) time, O(1) space",code:`void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int r = 0; r < n; ++r) {
        for (int c = r + 1; c < n; ++c) {
            swap(matrix[r][c], matrix[c][r]);
        }
    }

    for (int r = 0; r < n; ++r) {
        reverse(matrix[r].begin(), matrix[r].end());
    }
}`,followups:["How would you rotate counter-clockwise?","Can you do it layer by layer?","Why does this require a square matrix?"],review:"Rotate Image clockwise is transpose, then reverse each row."},
"LC 73":{signal:"Set Matrix Zeroes asks for marking rows and columns without losing original zero information.",hints:["If you zero immediately, you destroy information needed later.","Use first row and first column as marker storage.","Track whether the first row and first column originally had zeroes.","Apply markers to inner cells, then handle first row/column last."],interviewer:["Why not zero cells immediately?","How do first row and first column markers work?","Why handle first row and column last?","What is the space complexity?"],answer:["Detect whether first row and first column need to become zero.","For inner zeroes, mark matrix[i][0] and matrix[0][j].","Zero inner cells based on those markers.","Finally zero first row and first column if their flags are set."],complexity:"O(mn) time, O(1) space",code:`void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size();
    int n = matrix[0].size();
    bool firstRowZero = false;
    bool firstColZero = false;

    for (int c = 0; c < n; ++c) {
        if (matrix[0][c] == 0) firstRowZero = true;
    }
    for (int r = 0; r < m; ++r) {
        if (matrix[r][0] == 0) firstColZero = true;
    }

    for (int r = 1; r < m; ++r) {
        for (int c = 1; c < n; ++c) {
            if (matrix[r][c] == 0) {
                matrix[r][0] = 0;
                matrix[0][c] = 0;
            }
        }
    }

    for (int r = 1; r < m; ++r) {
        for (int c = 1; c < n; ++c) {
            if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                matrix[r][c] = 0;
            }
        }
    }

    if (firstRowZero) {
        for (int c = 0; c < n; ++c) matrix[0][c] = 0;
    }
    if (firstColZero) {
        for (int r = 0; r < m; ++r) matrix[r][0] = 0;
    }
}`,followups:["Can you solve it with O(m+n) space first?","Why must the first row/column be handled last?","What if matrix has one row or one column?"],review:"Set Matrix Zeroes uses first row and first column as markers, plus two flags for their original zero state."},
"LC 138":{signal:"Random pointers require preserving original-node identity; hashmap clone mapping is the safest default.",hints:["Create a clone node for every original node.","Map original node pointer to cloned node pointer.","Second pass wires next and random using the map.","Return the clone of head."],interviewer:["Why do we need a map?","Can random point backward or to itself?","Can we do O(1) extra space?","What if head is null?"],answer:["If head is null, return null.","First pass: clone every node and store old -> new.","Second pass: assign cloned next and random pointers from the map.","Return mp[head]."],complexity:"O(n) time, O(n) space",code:`Node* copyRandomList(Node* head) {
    if (!head) return nullptr;

    unordered_map<Node*, Node*> clone;
    for (Node* cur = head; cur; cur = cur->next) {
        clone[cur] = new Node(cur->val);
    }

    for (Node* cur = head; cur; cur = cur->next) {
        clone[cur]->next = cur->next ? clone[cur->next] : nullptr;
        clone[cur]->random = cur->random ? clone[cur->random] : nullptr;
    }

    return clone[head];
}`,followups:["Can you do it with O(1) extra space by interleaving nodes?","What if random points to null?","How do you avoid copying the same node twice?"],review:"Copy Random List is identity mapping: original node pointer -> cloned node pointer."},
"LC 92":{signal:"Reverse a sublist by using a dummy node and repeatedly moving nodes to the front of the reversed window.",hints:["A dummy node handles reversing from the head.","Move prev to the node before position left.","curr starts at the first node in the reversal range.","Repeatedly remove curr->next and insert it after prev."],interviewer:["Why use a dummy node?","What pointers must be preserved before rewiring?","What if left is 1?","What is the complexity?"],answer:["Create dummy before head.","Move prev to the node before left.","Use head-insertion inside the sublist for right-left steps.","Return dummy.next."],complexity:"O(n) time, O(1) space",code:`ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;

    for (int i = 1; i < left; ++i) {
        prev = prev->next;
    }

    ListNode* cur = prev->next;
    for (int i = 0; i < right - left; ++i) {
        ListNode* move = cur->next;
        cur->next = move->next;
        move->next = prev->next;
        prev->next = move;
    }

    return dummy.next;
}`,followups:["Can you reverse by detaching the segment first?","What if left equals right?","How do you avoid losing the tail?"],review:"Reverse Linked List II is pointer rewiring around a fixed predecessor before the reversed range."}
,"LC 34":{signal:"Sorted array + first and last occurrence asks for binary search on the boundary positions.",hints:["Search for the first index where nums[i] >= target.","Search for the first index where nums[i] > target.","The answer range is [left, rightExclusive - 1].","If left is out of bounds or nums[left] != target, the target does not exist."],interviewer:["What boundary are you binary searching?","Why not stop at any matching index?","How do you handle target missing?","What is the complexity?"],answer:["Write a lowerBound helper returning the first index with value >= target.","Write an upperBound helper returning the first index with value > target.","If lowerBound points outside the array or not at target, return [-1,-1].","Otherwise return [lowerBound, upperBound - 1]."],complexity:"O(log n) time, O(1) space",code:`vector<int> searchRange(vector<int>& nums, int target) {
    auto lowerBound = [&](int x) {
        int l = 0;
        int r = nums.size();
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] < x) l = mid + 1;
            else r = mid;
        }
        return l;
    };

    auto upperBound = [&](int x) {
        int l = 0;
        int r = nums.size();
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] <= x) l = mid + 1;
            else r = mid;
        }
        return l;
    };

    int left = lowerBound(target);
    if (left == nums.size() || nums[left] != target) {
        return {-1, -1};
    }

    int right = upperBound(target) - 1;
    return {left, right};
}`,followups:["Can you write it with one generic bound helper?","Can you write separate first/last binary searches?","How does this differ from searching for any occurrence?"],review:"LC34 is boundary binary search: find the first target and the first value greater than target."}
};
Object.assign(solidSolutionPatches,{
"LC 67":{signal:"Binary string addition is grade-school addition with carry from right to left.",hints:["Start from the end of both strings.","Keep a carry bit.","Append sum % 2 to the answer.","Reverse at the end."],interviewer:["How do you handle different lengths?","What happens after both strings are exhausted?","Why reverse the answer?","What is the complexity?"],answer:["Use two indices from the ends of a and b.","Add current bits plus carry.","Push the low bit and update carry.","Reverse the built string."],complexity:"O(max(m,n)) time, O(max(m,n)) space",code:`string addBinary(string a, string b) {
    string ans;
    int i = a.size() - 1;
    int j = b.size() - 1;
    int carry = 0;

    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        ans.push_back(char('0' + (sum % 2)));
        carry = sum / 2;
    }

    reverse(ans.begin(), ans.end());
    return ans;
}`,followups:["Can you do it without reversing?","How would this work for base 10 strings?","What if input is streamed from the end?"],review:"Add Binary is right-to-left addition with a carry."},
"LC 190":{signal:"Reverse bits by shifting the answer left and copying the low bit of n each round.",hints:["There are exactly 32 bits.","Take n & 1 as the next bit.","Shift ans left before adding that bit.","Shift n right to consume bits."],interviewer:["Why exactly 32 iterations?","Should n be treated as unsigned while shifting?","Can you optimize repeated calls?","What is the complexity?"],answer:["Initialize ans = 0 and read n as an unsigned bit pattern.","Repeat 32 times.","Shift ans left and OR the current low bit.","Shift the unsigned copy right."],complexity:"O(32) time, O(1) space",code:`class Solution {
public:
    int reverseBits(int n) {
        unsigned int x = static_cast<unsigned int>(n);
        unsigned int ans = 0;
        for (int i = 0; i < 32; ++i) {
            ans = (ans << 1) | (x & 1);
            x >>= 1;
        }
        return static_cast<int>(ans);
    }
};`,followups:["How would you cache bytes for many calls?","What if the integer width changes?","Why unsigned matters?"],review:"Reverse Bits copies low bits of n into the high-to-low order of the answer."},
"LC 191":{signal:"Counting 1 bits can repeatedly remove the lowest set bit.",hints:["n & (n - 1) clears the lowest set bit.","Each loop removes one 1 bit.","Count how many removals happen.","Treat n as an unsigned bit pattern while shifting or clearing bits."],interviewer:["What does n & (n - 1) do?","Is this better than checking all 32 bits?","What if n is zero?","What is the complexity?"],answer:["Read n as an unsigned bit pattern.","While the unsigned copy is nonzero, clear its lowest set bit.","Increment count each time.","Return count."],complexity:"O(k) time where k is number of set bits, O(1) space",code:`int hammingWeight(int n) {
    unsigned int x = static_cast<unsigned int>(n);
    int count = 0;
    while (x) {
        x &= (x - 1);
        ++count;
    }
    return count;
}`,followups:["Can you use a lookup table?","Can you use compiler builtins?","What is the fixed-width complexity?"],review:"Number of 1 Bits is lowest-set-bit deletion."},
"LC 136":{signal:"Every duplicate cancels under xor, leaving the single number.",hints:["x ^ x = 0.","x ^ 0 = x.","Xor is commutative, so order does not matter.","Xor all numbers together."],interviewer:["Why does xor cancellation work?","Does order matter?","What if every number appears three times?","What is the complexity?"],answer:["Initialize ans = 0.","Xor every number into ans.","Pairs cancel to zero.","Return the remaining value."],complexity:"O(n) time, O(1) space",code:`int singleNumber(vector<int>& nums) {
    int ans = 0;
    for (int x : nums) ans ^= x;
    return ans;
}`,followups:["What if every number appears three times?","What if two numbers are single?","Can a hashmap solve it?"],review:"Single Number is xor cancellation."},
"LC 9":{signal:"Palindrome Number can reverse only the second half of the digits to avoid overflow.",hints:["Negative numbers are not palindromes.","Numbers ending in 0 are not palindromes unless the number is 0.","Build reversedHalf until it reaches or passes x.","Compare x with reversedHalf or reversedHalf / 10."],interviewer:["Why reverse only half?","How do you avoid overflow?","What about 10 or negative numbers?","What is the complexity?"],answer:["Reject negatives and nonzero numbers ending in zero.","Move digits from x into reversedHalf until reversedHalf >= x.","For even length, compare x == reversedHalf.","For odd length, compare x == reversedHalf / 10."],complexity:"O(log n) time, O(1) space",code:`bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;

    int reversedHalf = 0;
    while (x > reversedHalf) {
        reversedHalf = reversedHalf * 10 + x % 10;
        x /= 10;
    }

    return x == reversedHalf || x == reversedHalf / 10;
}`,followups:["Can you solve it by converting to string?","Why does reversing the whole number risk overflow?","How do odd digit counts work?"],review:"Palindrome Number is safest by reversing only half of the digits."},
"LC 172":{signal:"Trailing zeroes come from factors of 10, which are limited by factors of 5.",hints:["A trailing zero needs 2 * 5.","There are always more factors of 2 than 5 in n!.","Count multiples of 5, 25, 125, and so on.","Repeatedly divide n by 5 and accumulate."],interviewer:["Why count fives instead of tens?","Why include 25 and 125?","What is the complexity?","What if n is zero?"],answer:["Initialize ans = 0.","While n > 0, divide n by 5.","Add the quotient to ans.","Return ans."],complexity:"O(log_5 n) time, O(1) space",code:`int trailingZeroes(int n) {
    int ans = 0;
    while (n > 0) {
        n /= 5;
        ans += n;
    }
    return ans;
}`,followups:["Why not compute factorial?","How would this change in another base?","Why do powers of 5 contribute multiple times?"],review:"Factorial trailing zeroes are counted by factors of 5."},
"LC 74":{signal:"A sorted 2D matrix with row ordering can be treated as one sorted array.",hints:["Map virtual index mid to row = mid / n and col = mid % n.","Search over [0, m*n).","Compare matrix[row][col] with target.","This is ordinary binary search on a flattened view."],interviewer:["Why is the flattened order sorted?","How do you map index to row and column?","What if matrix is empty?","What is the complexity?"],answer:["Let m and n be dimensions.","Binary search from 0 to m*n - 1.","Map mid to matrix[mid/n][mid%n].","Return true if found, otherwise false."],complexity:"O(log(mn)) time, O(1) space",code:`bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size();
    int n = matrix[0].size();
    int l = 0;
    int r = m * n - 1;

    while (l <= r) {
        int mid = l + (r - l) / 2;
        int value = matrix[mid / n][mid % n];
        if (value == target) return true;
        if (value < target) l = mid + 1;
        else r = mid - 1;
    }

    return false;
}`,followups:["What if each row and column is sorted but rows are not globally ordered?","Can you binary search row then column?","What is the flattened index mapping?"],review:"Search a 2D Matrix is binary search on a flattened sorted matrix."},
"LC 162":{signal:"Peak element can be found by moving toward the rising slope.",hints:["Compare nums[mid] with nums[mid + 1].","If nums[mid] < nums[mid+1], a peak exists on the right.","Otherwise a peak exists on the left including mid.","This works because virtual boundaries are negative infinity."],interviewer:["Why does moving uphill find a peak?","Why compare mid and mid+1?","What about one element?","What is the complexity?"],answer:["Binary search while l < r.","If nums[mid] < nums[mid+1], move l to mid + 1.","Else move r to mid.","Return l."],complexity:"O(log n) time, O(1) space",code:`int findPeakElement(vector<int>& nums) {
    int l = 0;
    int r = nums.size() - 1;

    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] < nums[mid + 1]) l = mid + 1;
        else r = mid;
    }

    return l;
}`,followups:["What if adjacent equal values are allowed?","Can linear scan solve it?","Why is any peak acceptable?"],review:"Find Peak Element uses slope direction to keep a side that must contain a peak."},
"LC 153":{signal:"Minimum in rotated sorted array is the boundary where sorted order wraps.",hints:["Compare nums[mid] with nums[right].","If nums[mid] > nums[right], the minimum is to the right.","Otherwise the minimum is at mid or to the left.","Keep the interval containing the rotation boundary."],interviewer:["Why compare with right instead of left?","What if the array is not rotated?","What if duplicates exist?","What is the complexity?"],answer:["Binary search while l < r.","If nums[mid] > nums[r], move l to mid + 1.","Otherwise move r to mid.","Return nums[l]."],complexity:"O(log n) time, O(1) space",code:`int findMin(vector<int>& nums) {
    int l = 0;
    int r = nums.size() - 1;

    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] > nums[r]) l = mid + 1;
        else r = mid;
    }

    return nums[l];
}`,followups:["What if duplicates are allowed?","How do you find the rotation index?","Why does an unrotated array still work?"],review:"Find Minimum in Rotated Sorted Array binary-searches the rotation boundary."},
"LC 17":{signal:"Phone digit combinations are classic backtracking over choices per digit.",hints:["Map each digit to its letters.","Build one character per input digit.","When path length equals digits length, record it.","Backtrack by pushing and popping one letter."],interviewer:["What is the recursion state?","What if digits is empty?","How many combinations exist?","What is the complexity?"],answer:["Return empty list for empty digits.","Use a digit-to-letters table.","DFS by index into digits and current path.","Append path when index reaches digits length."],complexity:"O(4^n * n) time, O(n) recursion space excluding output",code:`vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> letters = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> ans;
    string path;

    function<void(int)> dfs = [&](int idx) {
        if (idx == digits.size()) {
            ans.push_back(path);
            return;
        }
        for (char ch : letters[digits[idx] - '0']) {
            path.push_back(ch);
            dfs(idx + 1);
            path.pop_back();
        }
    };

    dfs(0);
    return ans;
}`,followups:["Can you solve it iteratively?","Why is output size exponential?","What if digits contain 0 or 1?"],review:"Letter Combinations is DFS over one letter choice per digit."},
"LC 77":{signal:"Combinations means choose k numbers from 1..n with backtracking and pruning.",hints:["The path stores chosen numbers.","Start controls the next candidate number.","When path size is k, record it.","Prune when not enough numbers remain."],interviewer:["What is the recursion state?","How do you avoid duplicates?","Can you prune?","What is the complexity?"],answer:["DFS with start and current path.","If path size is k, push it to answer.","Loop x from start while enough numbers remain.","Choose x, recurse with x+1, then undo."],complexity:"O(C(n,k) * k) time, O(k) recursion space excluding output",code:`vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> ans;
    vector<int> path;

    function<void(int)> dfs = [&](int start) {
        if (path.size() == k) {
            ans.push_back(path);
            return;
        }

        int need = k - path.size();
        for (int x = start; x <= n - need + 1; ++x) {
            path.push_back(x);
            dfs(x + 1);
            path.pop_back();
        }
    };

    dfs(1);
    return ans;
}`,followups:["How does pruning work?","How is this different from permutations?","Can you generate in lexicographic order?"],review:"Combinations uses increasing start index so each set is generated once."},
"LC 46":{signal:"Permutations means choose every unused number for the next position.",hints:["The path order matters.","Use a used array to avoid reusing a number.","When path length equals nums length, record it.","Undo both path and used state after recursion."],interviewer:["What is the recursion state?","How do you prevent reusing elements?","What if nums contains duplicates?","What is the complexity?"],answer:["Track path and used flags.","At each depth, try every unused number.","Mark used, recurse, then undo.","Record path when it reaches nums.size()."],complexity:"O(n! * n) time, O(n) recursion space excluding output",code:`vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> path;
    vector<bool> used(nums.size(), false);

    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) {
            ans.push_back(path);
            return;
        }

        for (int i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = true;
            path.push_back(nums[i]);
            dfs();
            path.pop_back();
            used[i] = false;
        }
    };

    dfs();
    return ans;
}`,followups:["How would duplicates change it?","Can you do in-place swapping?","Why is time factorial?"],review:"Permutations is backtracking over unused elements for each position."}
});
Object.assign(solidSolutionPatches,{
"LC 289":{signal:"Game of Life needs simultaneous updates, so encode old and new state in the same cell.",hints:["You cannot update a cell and immediately let neighbors see only the new state.","Use transitional values: live->dead and dead->live.","Count live neighbors from the original state.","Finalize every cell after all transitions are marked."],interviewer:["Why is simultaneous update important?","How do transitional states preserve old values?","How many neighbors do we check?","What is the complexity?"],answer:["For each cell, count live neighbors using abs(board[r][c]) == 1.","Mark live-to-dead as -1 and dead-to-live as 2.","After all cells are marked, convert positive values to 1 and others to 0.","This uses O(1) extra space."],complexity:"O(mn) time, O(1) space",code:`void gameOfLife(vector<vector<int>>& board) {
    int m = board.size(), n = board[0].size();
    vector<int> dirs = {-1, 0, 1};

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            int live = 0;
            for (int dr : dirs) {
                for (int dc : dirs) {
                    if (dr == 0 && dc == 0) continue;
                    int nr = r + dr, nc = c + dc;
                    if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                    if (abs(board[nr][nc]) == 1) ++live;
                }
            }

            if (board[r][c] == 1 && (live < 2 || live > 3)) board[r][c] = -1;
            if (board[r][c] == 0 && live == 3) board[r][c] = 2;
        }
    }

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            board[r][c] = board[r][c] > 0 ? 1 : 0;
        }
    }
}`,followups:["What if the board is infinite?","Can you use a copy board?","Why do transitional values work?"],review:"Game of Life in-place uses encoded transition states so every neighbor read still sees the old generation."},
"LC 82":{signal:"Sorted list duplicate removal needs deleting the entire duplicate run, not keeping one copy.",hints:["Use a dummy node because the head may be deleted.","prev points to the last confirmed unique node.","If curr has duplicates, skip the entire run.","Otherwise advance prev normally."],interviewer:["Why use a dummy node?","How do you skip all duplicates?","What if duplicates start at head?","What is the complexity?"],answer:["Create dummy before head.","Walk with prev while prev->next exists.","If prev->next starts a duplicate run, skip all nodes with that value.","Otherwise move prev forward."],complexity:"O(n) time, O(1) space",code:`ListNode* deleteDuplicates(ListNode* head) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;

    while (prev->next) {
        ListNode* cur = prev->next;
        if (cur->next && cur->val == cur->next->val) {
            int duplicate = cur->val;
            while (prev->next && prev->next->val == duplicate) {
                prev->next = prev->next->next;
            }
        } else {
            prev = prev->next;
        }
    }

    return dummy.next;
}`,followups:["How is this different from keeping one duplicate?","What if the list is not sorted?","How do you avoid losing the tail?"],review:"Remove Duplicates from Sorted List II skips the whole duplicate run using a predecessor pointer."},
"LC 61":{signal:"Rotate List is pointer rewiring after reducing k modulo length.",hints:["First compute list length and tail.","k may be larger than length, so use k %= length.","Connect tail to head to form a cycle.","Break the cycle at the new tail."],interviewer:["Why use k modulo length?","Where is the new tail?","How do you avoid losing nodes?","What if head is null?"],answer:["Handle empty or single-node lists.","Find length and tail.","Make the list circular.","Move length - k steps to find new tail, set new head, then break the cycle."],complexity:"O(n) time, O(1) space",code:`ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next || k == 0) return head;

    int len = 1;
    ListNode* tail = head;
    while (tail->next) {
        tail = tail->next;
        ++len;
    }

    k %= len;
    if (k == 0) return head;

    tail->next = head;
    int stepsToNewTail = len - k;
    ListNode* newTail = tail;
    while (stepsToNewTail--) {
        newTail = newTail->next;
    }

    ListNode* newHead = newTail->next;
    newTail->next = nullptr;
    return newHead;
}`,followups:["What if k is huge?","Can you do it without making a cycle?","What if the list has one node?"],review:"Rotate List makes a cycle, then breaks it after length-k steps."},
"LC 86":{signal:"Partition List is stable two-list construction: nodes below x and nodes at least x.",hints:["Preserve original relative order.","Use two dummy heads for small and large partitions.","Append each node to the correct list.","Terminate the large list to avoid cycles."],interviewer:["Do we need stable order?","Why two dummy nodes?","Why set large tail next to null?","What is the complexity?"],answer:["Create before and after dummy lists.","Walk the original list and append each node to the right list.","Connect before tail to after head.","Set after tail next to null and return before head."],complexity:"O(n) time, O(1) space",code:`ListNode* partition(ListNode* head, int x) {
    ListNode beforeDummy(0), afterDummy(0);
    ListNode* before = &beforeDummy;
    ListNode* after = &afterDummy;

    while (head) {
        if (head->val < x) {
            before->next = head;
            before = before->next;
        } else {
            after->next = head;
            after = after->next;
        }
        head = head->next;
    }

    after->next = nullptr;
    before->next = afterDummy.next;
    return beforeDummy.next;
}`,followups:["What if order does not matter?","Why can old next pointers create cycles?","Can you do it by swapping values?"],review:"Partition List uses two stable chains and reconnects them at the end."},
"LC 106":{signal:"Postorder's last element is root; inorder splits left and right subtrees.",hints:["Use a hashmap from value to inorder index.","Postorder root is consumed from the end.","Build right subtree before left because postorder is left-right-root.","The inorder range defines the current subtree."],interviewer:["Why build right before left?","How does inorder split subtrees?","What is the recursion state?","What is the complexity?"],answer:["Map inorder values to indices.","Keep an index at the end of postorder.","Recursive helper takes inorder bounds.","Create root from postorder index, build right then left, and return root."],complexity:"O(n) time, O(n) space",code:`TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
    unordered_map<int, int> pos;
    for (int i = 0; i < inorder.size(); ++i) pos[inorder[i]] = i;
    int post = postorder.size() - 1;

    function<TreeNode*(int,int)> build = [&](int l, int r) -> TreeNode* {
        if (l > r) return nullptr;
        int val = postorder[post--];
        TreeNode* root = new TreeNode(val);
        int mid = pos[val];
        root->right = build(mid + 1, r);
        root->left = build(l, mid - 1);
        return root;
    };

    return build(0, inorder.size() - 1);
}`,followups:["Why are values assumed unique?","Can you build from preorder and inorder?","What is recursion depth?"],review:"Inorder plus postorder reconstruction consumes roots from postorder's end and splits by inorder index."},
"LC 117":{signal:"Connect next right pointers level by level using already-built next pointers.",hints:["No perfect-tree assumption.","Use a dummy head for the next level.","Walk the current level through next pointers.","Append each child to the next-level chain."],interviewer:["Why not rely on complete tree structure?","How does dummy simplify the next level?","Can you do O(1) extra space?","What edge cases matter?"],answer:["Start with cur at root.","For each level, use dummy and tail to build next level.","Walk cur across the current level through next pointers.","Move cur to dummy.next for the next level."],complexity:"O(n) time, O(1) extra space",code:`Node* connect(Node* root) {
    Node* cur = root;
    while (cur) {
        Node dummy(0);
        Node* tail = &dummy;

        while (cur) {
            if (cur->left) {
                tail->next = cur->left;
                tail = tail->next;
            }
            if (cur->right) {
                tail->next = cur->right;
                tail = tail->next;
            }
            cur = cur->next;
        }

        cur = dummy.next;
    }
    return root;
}`,followups:["Can BFS solve it?","Why is this O(1) extra space?","How does it differ from perfect binary tree version?"],review:"Populating Next Right Pointers II builds each next level while traversing the current level's next chain."},
"LC 114":{signal:"Flatten tree to linked list means preorder traversal rewired in-place.",hints:["Flatten left and right subtrees first.","If a left subtree exists, move it to the right.","Attach the original right subtree to the tail of the flattened left subtree.","Set left to null."],interviewer:["What order should the final list follow?","Why store original right subtree?","Can you do iterative preorder?","What is the complexity?"],answer:["Recursively flatten left and right.","If root has left, save original right.","Move left subtree to right and null out left.","Find the tail of moved subtree and attach saved right."],complexity:"O(n) time, O(h) recursion space",code:`void flatten(TreeNode* root) {
    if (!root) return;

    flatten(root->left);
    flatten(root->right);

    TreeNode* left = root->left;
    TreeNode* right = root->right;

    if (left) {
        root->right = left;
        root->left = nullptr;

        TreeNode* tail = root->right;
        while (tail->right) tail = tail->right;
        tail->right = right;
    }
}`,followups:["Can you avoid repeated tail scans?","Can you solve with reverse preorder?","Can you solve iteratively with a stack?"],review:"Flatten Binary Tree rewires preorder order into right pointers and clears left pointers."},
"LC 173":{signal:"BST iterator is controlled inorder traversal with a stack of left ancestors.",hints:["Inorder traversal of BST is sorted.","Push all left nodes from the current root.","next pops the smallest available node.","After popping, push the left chain of its right child."],interviewer:["Why does stack top hold the next smallest?","What is amortized O(1)?","What is the space complexity?","What if next is called without hasNext?"],answer:["Constructor pushes the root's left chain.","next pops the stack top.","If popped node has right child, push its left chain.","hasNext checks whether stack is nonempty."],complexity:"O(1) amortized next, O(h) space",code:`class BSTIterator {
    stack<TreeNode*> st;

    void pushLeft(TreeNode* node) {
        while (node) {
            st.push(node);
            node = node->left;
        }
    }

public:
    BSTIterator(TreeNode* root) {
        pushLeft(root);
    }

    int next() {
        TreeNode* node = st.top();
        st.pop();
        pushLeft(node->right);
        return node->val;
    }

    bool hasNext() {
        return !st.empty();
    }
};`,followups:["Can you support previous?","Why is next amortized O(1)?","Can you materialize all values first?"],review:"BST Iterator lazily performs inorder traversal with a stack."},
"LC 222":{signal:"Complete tree node count can use subtree heights to skip perfect subtrees.",hints:["In a complete tree, equal leftmost heights mean the subtree is perfect.","A perfect subtree with height h has 2^h - 1 nodes.","If left and right heights differ, recurse into children.","Height computation follows left edges."],interviewer:["What property of complete trees helps?","How do you detect a perfect subtree?","What is the complexity?","What if the tree is not complete?"],answer:["Compute leftmost height from root->left and root->right.","If heights are equal, left subtree is perfect; count it and recurse right.","Otherwise right subtree is perfect one level smaller; count it and recurse left.","Return total nodes."],complexity:"O(log^2 n) time, O(log n) recursion space",code:`int countNodes(TreeNode* root) {
    if (!root) return 0;

    auto height = [](TreeNode* node) {
        int h = 0;
        while (node) {
            ++h;
            node = node->left;
        }
        return h;
    };

    int lh = height(root->left);
    int rh = height(root->right);

    if (lh == rh) {
        return (1 << lh) + countNodes(root->right);
    }
    return (1 << rh) + countNodes(root->left);
}`,followups:["Why does equal height mean left subtree is perfect?","Can O(n) DFS solve it?","What about very deep trees and shifting overflow?"],review:"Count Complete Tree Nodes skips perfect subtrees using leftmost heights."},
"LC 637":{signal:"Average by tree level is BFS with fixed queue size per level.",hints:["Queue contains one level's frontier.","At each level, record queue size before popping.","Sum values for exactly that many nodes.","Push children for the next level."],interviewer:["Why BFS?","Why store level size?","Should sum be int or double/long long?","What is the complexity?"],answer:["If root is null, return empty.","Use a queue for BFS.","For each level, sum all nodes in that level and divide by count.","Push children while processing."],complexity:"O(n) time, O(width) space",code:`vector<double> averageOfLevels(TreeNode* root) {
    vector<double> ans;
    if (!root) return ans;

    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        long long sum = 0;
        for (int i = 0; i < size; ++i) {
            TreeNode* node = q.front();
            q.pop();
            sum += node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        ans.push_back((double)sum / size);
    }
    return ans;
}`,followups:["Can DFS by depth solve it?","Why use long long for sum?","What is width space?"],review:"Average of Levels is level-order BFS with one sum per fixed-size level."},
"LC 103":{signal:"Zigzag level order is BFS level traversal with alternating write direction.",hints:["BFS gives one level at a time.","Use a vector of level size.","Place values left-to-right or right-to-left depending on a flag.","Flip the flag after every level."],interviewer:["Why not reverse every other vector?","How do you preserve level boundaries?","What is the complexity?","Can DFS solve it?"],answer:["Use a queue for BFS.","For each level, allocate vector<int> level(size).","Write node values at index i or size-1-i based on direction.","Flip direction after the level."],complexity:"O(n) time, O(width) space",code:`vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    if (!root) return ans;

    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;

    while (!q.empty()) {
        int size = q.size();
        vector<int> level(size);
        for (int i = 0; i < size; ++i) {
            TreeNode* node = q.front();
            q.pop();
            int idx = leftToRight ? i : size - 1 - i;
            level[idx] = node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        ans.push_back(level);
        leftToRight = !leftToRight;
    }

    return ans;
}`,followups:["Can DFS fill by depth?","Can you reverse every other level instead?","How do you handle an empty tree?"],review:"Zigzag Level Order is BFS plus alternating index placement."},
"LC 530":{signal:"Minimum difference in BST comes from adjacent values in sorted inorder order.",hints:["Inorder traversal of BST is sorted.","The minimum absolute difference must be between adjacent inorder values.","Track previous visited value.","Update best difference at each node."],interviewer:["Why only adjacent inorder values?","How do you avoid storing all values?","What is recursion space?","What if tree has one node?"],answer:["Run inorder DFS.","Keep prev pointer/value from the previous node.","At each node, update best with node->val - prev.","Return best."],complexity:"O(n) time, O(h) space",code:`int getMinimumDifference(TreeNode* root) {
    int best = INT_MAX;
    TreeNode* prev = nullptr;

    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node) return;
        inorder(node->left);
        if (prev) best = min(best, node->val - prev->val);
        prev = node;
        inorder(node->right);
    };

    inorder(root);
    return best;
}`,followups:["Can you do iterative inorder?","Why not compare every pair?","What if duplicates are allowed?"],review:"Minimum Absolute Difference in BST is adjacent difference in inorder order."},
"LC 130":{signal:"Surrounded Regions keeps border-connected O cells and flips the rest.",hints:["Only O regions not connected to border are captured.","Start DFS/BFS from border O cells.","Mark safe cells temporarily.","Flip remaining O to X and safe marks back to O."],interviewer:["Why start from the border?","What cells are safe?","Can DFS overflow stack?","What is the complexity?"],answer:["Mark all border-connected O cells as safe.","Scan all cells after marking.","Flip unmarked O cells to X.","Restore safe marks back to O."],complexity:"O(mn) time, O(mn) worst-case space",code:`void solve(vector<vector<char>>& board) {
    int m = board.size(), n = board[0].size();
    function<void(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != 'O') return;
        board[r][c] = '#';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    };

    for (int r = 0; r < m; ++r) {
        dfs(r, 0);
        dfs(r, n - 1);
    }
    for (int c = 0; c < n; ++c) {
        dfs(0, c);
        dfs(m - 1, c);
    }

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (board[r][c] == 'O') board[r][c] = 'X';
            else if (board[r][c] == '#') board[r][c] = 'O';
        }
    }
}`,followups:["Can BFS avoid recursion depth?","Why are border-connected cells not captured?","Can this be solved with Union Find?"],review:"Surrounded Regions is reverse flood fill from border O cells."}
});
Object.assign(solidSolutionPatches,{
"LC 39":{signal:"Combination Sum is backtracking where candidates can be reused by recursing with the same index.",complexity:"O(number of combinations * average length) time, O(target/minCandidate) recursion space",code:`vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> ans;
    vector<int> path;
    sort(candidates.begin(), candidates.end());

    function<void(int,int)> dfs = [&](int start, int remain) {
        if (remain == 0) {
            ans.push_back(path);
            return;
        }
        for (int i = start; i < candidates.size() && candidates[i] <= remain; ++i) {
            path.push_back(candidates[i]);
            dfs(i, remain - candidates[i]);
            path.pop_back();
        }
    };

    dfs(0, target);
    return ans;
}`,hints:["Sort candidates for pruning.","Use start index to avoid duplicate orderings.","Recurse with i, not i + 1, because reuse is allowed.","Record path when remain becomes zero."],answer:["Backtrack with start and remaining target.","Try candidates from start forward.","Reuse current candidate by recursing with the same index.","Undo after recursion."],review:"Combination Sum is choose/recurse/undo with same-index recursion for reuse."},
"LC 79":{signal:"Word Search is grid backtracking with visited marking and four-direction movement.",complexity:"O(mn * 4^L) time, O(L) recursion space",code:`bool exist(vector<vector<char>>& board, string word) {
    int m = board.size(), n = board[0].size();

    function<bool(int,int,int)> dfs = [&](int r, int c, int idx) {
        if (idx == word.size()) return true;
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[idx]) return false;

        char saved = board[r][c];
        board[r][c] = '#';
        bool found = dfs(r + 1, c, idx + 1) ||
                     dfs(r - 1, c, idx + 1) ||
                     dfs(r, c + 1, idx + 1) ||
                     dfs(r, c - 1, idx + 1);
        board[r][c] = saved;
        return found;
    };

    for (int r = 0; r < m; ++r)
        for (int c = 0; c < n; ++c)
            if (dfs(r, c, 0)) return true;
    return false;
}`,hints:["Try every cell as a start.","Mark the current cell visited before exploring neighbors.","Restore it after recursion.","Stop once the whole word is matched."],answer:["DFS from each board cell.","Match one character per recursion depth.","Temporarily mark visited cells.","Return true as soon as any path matches."],review:"Word Search is path backtracking with in-place visited marking."},
"LC 108":{signal:"Sorted array to BST uses the middle element as root to keep the tree height balanced.",complexity:"O(n) time, O(log n) recursion space",code:`TreeNode* sortedArrayToBST(vector<int>& nums) {
    function<TreeNode*(int,int)> build = [&](int l, int r) -> TreeNode* {
        if (l > r) return nullptr;
        int mid = l + (r - l) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = build(l, mid - 1);
        root->right = build(mid + 1, r);
        return root;
    };
    return build(0, nums.size() - 1);
}`,hints:["A balanced BST needs roughly equal left and right subtree sizes.","Choose the middle element as root.","Recursively build left and right halves.","Base case is empty range."],answer:["Pick mid as root.","Build left from left half.","Build right from right half.","Return root."],review:"Sorted Array to BST is divide and conquer using the middle value as root."},
"LC 148":{signal:"Sort List needs O(n log n) linked-list merge sort.",complexity:"O(n log n) time, O(log n) recursion space",code:`ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;

    ListNode* slow = head;
    ListNode* fast = head->next;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    ListNode* mid = slow->next;
    slow->next = nullptr;

    ListNode* left = sortList(head);
    ListNode* right = sortList(mid);

    ListNode dummy;
    ListNode* tail = &dummy;
    while (left && right) {
        if (left->val <= right->val) {
            tail->next = left;
            left = left->next;
        } else {
            tail->next = right;
            right = right->next;
        }
        tail = tail->next;
    }
    tail->next = left ? left : right;
    return dummy.next;
}`,hints:["Use slow/fast pointers to split the list.","Break the list into two halves.","Sort both halves recursively.","Merge two sorted linked lists."],answer:["Split list around the middle.","Recursively sort both halves.","Merge sorted halves with a dummy node.","Return merged head."],review:"Sort List is merge sort adapted to linked-list pointer splitting and merging."},
"LC 23":{signal:"Merge k sorted lists uses a min-heap over the current head of each list.",complexity:"O(N log k) time, O(k) space",code:`ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) {
        return a->val > b->val;
    };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);

    for (ListNode* node : lists) {
        if (node) pq.push(node);
    }

    ListNode dummy;
    ListNode* tail = &dummy;
    while (!pq.empty()) {
        ListNode* node = pq.top();
        pq.pop();
        tail->next = node;
        tail = tail->next;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}`,hints:["Each list is already sorted.","A heap gives the smallest current head.","After taking a node, push its next node.","The heap size is at most k."],answer:["Push all non-null list heads into a min-heap.","Repeatedly pop the smallest node.","Append it to the answer.","Push its next node if present."],review:"Merge k Sorted Lists is repeated best-candidate selection with a min-heap."},
"LC 918":{signal:"Circular maximum subarray is max(normal Kadane, total sum - minimum subarray).",complexity:"O(n) time, O(1) space",code:`int maxSubarraySumCircular(vector<int>& nums) {
    int total = 0;
    int curMax = 0, bestMax = nums[0];
    int curMin = 0, bestMin = nums[0];

    for (int x : nums) {
        curMax = max(x, curMax + x);
        bestMax = max(bestMax, curMax);
        curMin = min(x, curMin + x);
        bestMin = min(bestMin, curMin);
        total += x;
    }

    if (bestMax < 0) return bestMax;
    return max(bestMax, total - bestMin);
}`,hints:["Non-wrapping answer is ordinary Kadane.","Wrapping answer equals total minus the minimum middle subarray.","All-negative arrays must return the largest single value.","Track max subarray and min subarray in one pass."],answer:["Compute best normal subarray.","Compute minimum subarray.","If all values are negative, return best normal.","Otherwise return max(best normal, total - best minimum)."],review:"Maximum circular subarray is Kadane plus total minus minimum subarray."},
"LC 139":{signal:"Word Break is boolean DP over prefixes of the string.",complexity:"O(n^2 * substring cost) time, O(n + dict) space",code:`bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    vector<bool> dp(s.size() + 1, false);
    dp[0] = true;

    for (int i = 1; i <= s.size(); ++i) {
        for (int j = 0; j < i; ++j) {
            if (dp[j] && dict.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[s.size()];
}`,hints:["dp[i] means s[0..i) can be segmented.","Try the last word boundary j.","Need dp[j] true and s[j..i) in dictionary.","dp[0] is true for the empty prefix."],answer:["Put dictionary words in a set.","Use dp over prefix length.","For each i, try all previous cut positions j.","Return dp[n]."],review:"Word Break asks whether each prefix can end with a dictionary word."},
"LC 322":{signal:"Coin Change is min-count DP over amounts.",complexity:"O(amount * number_of_coins) time, O(amount) space",code:`int coinChange(vector<int>& coins, int amount) {
    const int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;

    for (int a = 1; a <= amount; ++a) {
        for (int coin : coins) {
            if (coin <= a) {
                dp[a] = min(dp[a], dp[a - coin] + 1);
            }
        }
    }

    return dp[amount] == INF ? -1 : dp[amount];
}`,hints:["dp[a] is the fewest coins to make amount a.","Initialize impossible states to a large value.","For each coin, transition from dp[a-coin].","Return -1 if amount remains impossible."],answer:["Create dp[0..amount].","Set dp[0] = 0.","For each amount, try every coin.","Take the minimum valid transition."],review:"Coin Change is minimum coins for every amount up to target."},
"LC 300":{signal:"LIS can be solved by maintaining smallest tail value for each subsequence length.",complexity:"O(n log n) time, O(n) space",code:`int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,hints:["tails[len] stores the smallest possible tail for length len+1.","A smaller tail is always better for future extension.","Use lower_bound for strictly increasing subsequences.","The answer is tails.size()."],answer:["Maintain a tails array.","For each x, find first tail >= x.","Replace it, or append if x is larger than all tails.","Return number of tails."],review:"LIS O(n log n) keeps minimal possible tails, not the actual subsequence."},
"LC 120":{signal:"Triangle minimum path sum is bottom-up DP from the last row.",complexity:"O(n^2) time, O(n) space",code:`int minimumTotal(vector<vector<int>>& triangle) {
    vector<int> dp = triangle.back();

    for (int r = triangle.size() - 2; r >= 0; --r) {
        for (int c = 0; c <= r; ++c) {
            dp[c] = triangle[r][c] + min(dp[c], dp[c + 1]);
        }
    }

    return dp[0];
}`,hints:["Start with the last row as known costs.","Move upward one row at a time.","Each cell can go to c or c+1 below.","dp[c] becomes the best cost from that cell to the bottom."],answer:["Copy last row into dp.","For each row from bottom-1 to top, update dp[c].","Use min of two children below.","Return dp[0]."],review:"Triangle DP is easiest bottom-up: each cell chooses the cheaper child below."},
"LC 63":{signal:"Unique Paths II is path-count DP with obstacles zeroing blocked states.",complexity:"O(mn) time, O(n) space",code:`int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
    int m = obstacleGrid.size(), n = obstacleGrid[0].size();
    vector<int> dp(n, 0);
    dp[0] = obstacleGrid[0][0] == 0 ? 1 : 0;

    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) {
            if (obstacleGrid[r][c] == 1) dp[c] = 0;
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }

    return dp[n - 1];
}`,hints:["dp[c] stores ways to reach current row, column c.","Obstacle cells contribute zero ways.","From an open cell, ways come from above dp[c] and left dp[c-1].","Initialize start to one if it is open."],answer:["Use a one-row dp array.","Set start ways based on obstacle at (0,0).","For each cell, zero dp[c] if blocked.","Otherwise add left ways when c > 0."],review:"Unique Paths II is path counting where obstacles reset the state to zero."},
"LC 5":{signal:"Longest palindromic substring can expand around every possible center.",complexity:"O(n^2) time, O(1) extra space",code:`string longestPalindrome(string s) {
    int bestStart = 0, bestLen = 1;

    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.size() && s[l] == s[r]) {
            --l;
            ++r;
        }
        int len = r - l - 1;
        if (len > bestLen) {
            bestLen = len;
            bestStart = l + 1;
        }
    };

    for (int i = 0; i < s.size(); ++i) {
        expand(i, i);
        expand(i, i + 1);
    }

    return s.substr(bestStart, bestLen);
}`,hints:["A palindrome is determined by its center.","There are odd and even centers.","Expand while characters match.","Track the best interval found."],answer:["For every index, expand odd and even centers.","After expansion, update best length and start.","Return the best substring."],review:"Longest Palindromic Substring is center expansion over odd and even centers."},
"LC 97":{signal:"Interleaving String is 2D DP over how many chars are taken from s1 and s2.",complexity:"O(mn) time, O(n) space",code:`bool isInterleave(string s1, string s2, string s3) {
    int m = s1.size(), n = s2.size();
    if (m + n != s3.size()) return false;

    vector<bool> dp(n + 1, false);
    dp[0] = true;

    for (int i = 0; i <= m; ++i) {
        for (int j = 0; j <= n; ++j) {
            if (i == 0 && j == 0) continue;
            bool ok = false;
            if (i > 0) ok = ok || (dp[j] && s1[i - 1] == s3[i + j - 1]);
            if (j > 0) ok = ok || (dp[j - 1] && s2[j - 1] == s3[i + j - 1]);
            dp[j] = ok;
        }
    }

    return dp[n];
}`,hints:["Lengths must add up.","dp[j] means current i and j chars can form prefix of s3.","Transition from taking next char of s1 or s2.","Use one row because only current and previous row are needed."],answer:["Reject if lengths do not add up.","Use DP over counts taken from s1 and s2.","Check whether current s3 char can come from s1 or s2.","Return dp[n]."],review:"Interleaving String tracks whether prefixes of s1 and s2 can form the prefix of s3."},
"LC 72":{signal:"Edit Distance is DP over prefixes of two words.",complexity:"O(mn) time, O(n) space",code:`int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<int> dp(n + 1);
    for (int j = 0; j <= n; ++j) dp[j] = j;

    for (int i = 1; i <= m; ++i) {
        int prevDiag = dp[0];
        dp[0] = i;
        for (int j = 1; j <= n; ++j) {
            int old = dp[j];
            if (word1[i - 1] == word2[j - 1]) dp[j] = prevDiag;
            else dp[j] = 1 + min({dp[j], dp[j - 1], prevDiag});
            prevDiag = old;
        }
    }

    return dp[n];
}`,hints:["dp[i][j] is edit distance between prefixes.","If last chars match, no new operation is needed.","Otherwise choose insert, delete, or replace.","Initialize empty-string conversions."],answer:["Initialize first row as insertions.","For each character of word1, update one DP row.","Use previous diagonal for replace/match.","Return dp[n]."],review:"Edit Distance compares prefixes and takes min of insert, delete, replace."},
"LC 221":{signal:"Maximal Square DP uses the smallest neighboring square plus one.",complexity:"O(mn) time, O(n) space",code:`int maximalSquare(vector<vector<char>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<int> dp(n + 1, 0);
    int best = 0;

    for (int r = 1; r <= m; ++r) {
        int prevDiag = 0;
        for (int c = 1; c <= n; ++c) {
            int old = dp[c];
            if (matrix[r - 1][c - 1] == '1') {
                dp[c] = 1 + min({dp[c], dp[c - 1], prevDiag});
                best = max(best, dp[c]);
            } else {
                dp[c] = 0;
            }
            prevDiag = old;
        }
    }

    return best * best;
}`,hints:["dp cell is side length of largest square ending there.","A square can grow only if top, left, and top-left support it.","For '0', dp is zero.","Track max side and return area."],answer:["Use one-row DP with a previous-diagonal variable.","For each 1 cell, compute min(top,left,diag)+1.","For 0 cell, reset to zero.","Return best side squared."],review:"Maximal Square grows from the minimum of top, left, and diagonal neighbors."},
"LC 201":{signal:"Bitwise AND over a range keeps only the common binary prefix.",complexity:"O(32) time, O(1) space",code:`int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left < right) {
        left >>= 1;
        right >>= 1;
        ++shift;
    }
    return left << shift;
}`,hints:["Any changing low bit becomes zero across the range.","Shift both endpoints until they match.","The remaining value is the common prefix.","Shift it back to restore position."],answer:["Count how many right shifts are needed until left equals right.","That equal value is the common prefix.","Shift it back by the count.","Return the result."],review:"Range Bitwise AND preserves only the common prefix of left and right."},
"LC 50":{signal:"Pow(x,n) uses fast exponentiation by squaring.",complexity:"O(log n) time, O(1) space",code:`double myPow(double x, int n) {
    long long exp = n;
    if (exp < 0) {
        x = 1.0 / x;
        exp = -exp;
    }

    double ans = 1.0;
    while (exp > 0) {
        if (exp & 1) ans *= x;
        x *= x;
        exp >>= 1;
    }
    return ans;
}`,hints:["Use long long for n to handle INT_MIN.","Negative exponent means invert x.","Square the base each step.","Multiply answer when current bit is 1."],answer:["Convert exponent to long long.","If negative, invert base and negate exponent.","Use binary exponentiation.","Return accumulated answer."],review:"Pow is binary exponentiation; each exponent bit decides whether to multiply current base."},
"LC 137":{signal:"Single Number II can count each bit modulo 3.",complexity:"O(32n) time, O(1) space",code:`int singleNumber(vector<int>& nums) {
    int ans = 0;
    for (int bit = 0; bit < 32; ++bit) {
        int count = 0;
        for (int x : nums) {
            count += (x >> bit) & 1;
        }
        if (count % 3) {
            ans |= (1 << bit);
        }
    }
    return ans;
}`,hints:["Numbers appearing three times contribute bit counts divisible by 3.","Count every bit position separately.","If count % 3 is one, the single number has that bit.","32-bit reconstruction handles negative values in int representation."],answer:["For each bit 0..31, count how many numbers contain it.","Take count modulo 3.","Set that bit in the answer if remainder is nonzero.","Return reconstructed integer."],review:"Single Number II is bit counting modulo three."},
"LC 373":{signal:"K smallest pair sums uses a min-heap frontier over sorted rows.",complexity:"O(k log min(k,m)) time, O(min(k,m)) space",code:`vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
    vector<vector<int>> ans;
    if (nums1.empty() || nums2.empty() || k == 0) return ans;

    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> pq;
    for (int i = 0; i < nums1.size() && i < k; ++i) {
        pq.emplace(nums1[i] + nums2[0], i, 0);
    }

    while (k-- > 0 && !pq.empty()) {
        auto [sum, i, j] = pq.top();
        pq.pop();
        ans.push_back({nums1[i], nums2[j]});
        if (j + 1 < nums2.size()) {
            pq.emplace(nums1[i] + nums2[j + 1], i, j + 1);
        }
    }

    return ans;
}`,hints:["Each nums1[i] defines a sorted row of pairs with nums2.","Seed the heap with the first pair of each row.","Pop the smallest pair, then advance that row.","Only seed up to k rows."],answer:["Push pairs (i,0) for first min(k,m) rows.","Pop smallest sum from heap.","Append that pair.","Push next pair from the same row."],review:"K smallest pair sums is heap frontier expansion over sorted pair rows."},
"LC 295":{signal:"Median stream uses two heaps: max-heap lower half and min-heap upper half.",complexity:"O(log n) addNum, O(1) findMedian, O(n) space",code:`class MedianFinder {
    priority_queue<int> lo;
    priority_queue<int, vector<int>, greater<int>> hi;

public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top());
        lo.pop();

        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return ((double)lo.top() + hi.top()) / 2.0;
    }
};`,hints:["Lower half is a max-heap.","Upper half is a min-heap.","Keep lower half same size or one larger.","Median is top of lower heap or average of both tops."],answer:["Insert into lower heap, then move its top to upper heap.","Rebalance if upper becomes larger.","For odd count, median is lower top.","For even count, average both tops."],review:"Median Finder maintains two balanced heaps split around the median."}
});
Object.assign(solidSolutionPatches,{
"LC 30":{signal:"Fixed-size word chunks plus concatenation coverage points to a word-length sliding window.",complexity:"O(n * wordLen) time, O(words) space",code:`vector<int> findSubstring(string s, vector<string>& words) {
    vector<int> ans;
    if (words.empty()) return ans;

    int wordLen = words[0].size();
    int wordCount = words.size();
    int totalLen = wordLen * wordCount;
    if (s.size() < totalLen) return ans;

    unordered_map<string, int> need;
    for (const string& word : words) need[word]++;

    for (int offset = 0; offset < wordLen; ++offset) {
        unordered_map<string, int> seen;
        int left = offset;
        int matched = 0;

        for (int right = offset; right + wordLen <= s.size(); right += wordLen) {
            string word = s.substr(right, wordLen);

            if (!need.count(word)) {
                seen.clear();
                matched = 0;
                left = right + wordLen;
                continue;
            }

            seen[word]++;
            matched++;

            while (seen[word] > need[word]) {
                string drop = s.substr(left, wordLen);
                seen[drop]--;
                matched--;
                left += wordLen;
            }

            if (matched == wordCount) {
                ans.push_back(left);
                string drop = s.substr(left, wordLen);
                seen[drop]--;
                matched--;
                left += wordLen;
            }
        }
    }

    return ans;
}`,hints:["All words have the same length, so scan in word-sized chunks.","Run one sliding window for each possible offset modulo word length.","Reset the window when a chunk is not in the required word map.","Shrink from the left when a word appears too many times."],answer:["Count how many times each word is required.","For every offset from 0 to wordLen - 1, scan chunks of size wordLen.","Maintain seen word counts inside the current chunk window.","When the window matches all words, record left and slide forward by one word."],review:"Substring with Concatenation is a sliding window over word chunks, with duplicate-word counts preserved."},
"LC 212":{signal:"Many word searches on one board points to Trie pruning plus DFS backtracking.",complexity:"O(total word chars + mn * 4^L) worst-case time, O(total word chars) space",code:`class Solution {
    struct TrieNode {
        TrieNode* child[26] = {};
        string word;
    };

    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->child[idx]) node->child[idx] = new TrieNode();
            node = node->child[idx];
        }
        node->word = word;
    }

    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node, vector<string>& ans) {
        if (r < 0 || c < 0 || r >= board.size() || c >= board[0].size()) return;
        char ch = board[r][c];
        if (ch == '#') return;

        TrieNode* next = node->child[ch - 'a'];
        if (!next) return;

        if (!next->word.empty()) {
            ans.push_back(next->word);
            next->word.clear();
        }

        board[r][c] = '#';
        dfs(board, r + 1, c, next, ans);
        dfs(board, r - 1, c, next, ans);
        dfs(board, r, c + 1, next, ans);
        dfs(board, r, c - 1, next, ans);
        board[r][c] = ch;
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        for (const string& word : words) insert(word);

        vector<string> ans;
        for (int r = 0; r < board.size(); ++r) {
            for (int c = 0; c < board[0].size(); ++c) {
                dfs(board, r, c, root, ans);
            }
        }
        return ans;
    }
};`,hints:["Build one trie for all target words.","During DFS, stop immediately when the current prefix is not in the trie.","Mark the board cell while it is on the current path, then restore it.","Clear a found word so duplicate paths do not add it twice."],answer:["Insert every word into a trie.","Start DFS from every board cell.","Move only into trie children that match the next board character.","When a trie node stores a word, add it and clear it to avoid duplicates."],review:"Word Search II combines Trie prefix pruning with DFS backtracking on the board."},
"LC 4":{signal:"Two sorted arrays plus logarithmic requirement points to binary search on the partition.",complexity:"O(log min(m,n)) time, O(1) space",code:`double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        return findMedianSortedArrays(nums2, nums1);
    }

    int m = nums1.size();
    int n = nums2.size();
    int totalLeft = (m + n + 1) / 2;
    int lo = 0, hi = m;

    while (lo <= hi) {
        int i = lo + (hi - lo) / 2;
        int j = totalLeft - i;

        int aLeft = (i == 0) ? INT_MIN : nums1[i - 1];
        int aRight = (i == m) ? INT_MAX : nums1[i];
        int bLeft = (j == 0) ? INT_MIN : nums2[j - 1];
        int bRight = (j == n) ? INT_MAX : nums2[j];

        if (aLeft <= bRight && bLeft <= aRight) {
            if ((m + n) % 2 == 1) return max(aLeft, bLeft);
            return ((double)max(aLeft, bLeft) + (double)min(aRight, bRight)) / 2.0;
        }

        if (aLeft > bRight) hi = i - 1;
        else lo = i + 1;
    }

    return 0.0;
}`,hints:["Binary search the cut position in the shorter array.","The other cut is determined by totalLeft - i.","A valid partition has left values <= right values across both arrays.","Use sentinels for empty left or right partitions."],answer:["Always binary search the shorter array.","Choose i items from nums1 and j items from nums2 for the left half.","Check whether max left is <= min right across the partition.","If valid, compute the median from boundary values."],review:"Median of Two Sorted Arrays is binary search over a valid left/right partition."},
"LC 149":{signal:"Collinear points require normalized slopes from each anchor point.",complexity:"O(n^2) time, O(n) space",code:`int maxPoints(vector<vector<int>>& points) {
    int n = points.size();
    if (n <= 2) return n;

    int best = 0;
    for (int i = 0; i < n; ++i) {
        unordered_map<string, int> count;
        int duplicates = 1;
        int local = 0;

        for (int j = i + 1; j < n; ++j) {
            long long dx = (long long)points[j][0] - points[i][0];
            long long dy = (long long)points[j][1] - points[i][1];

            if (dx == 0 && dy == 0) {
                duplicates++;
                continue;
            }

            long long g = std::gcd(llabs(dx), llabs(dy));
            dx /= g;
            dy /= g;

            if (dx < 0) {
                dx = -dx;
                dy = -dy;
            }
            if (dx == 0) dy = 1;
            if (dy == 0) dx = 1;

            string key = to_string(dy) + "/" + to_string(dx);
            local = max(local, ++count[key]);
        }

        best = max(best, local + duplicates);
    }

    return best;
}`,hints:["Use each point as an anchor.","Every other point with the same reduced slope lies on the same line through that anchor.","Normalize slope signs and vertical/horizontal lines.","Add duplicate anchor points to the best slope count."],answer:["For each anchor point, count normalized slopes to later points.","Reduce dx and dy by gcd to avoid floating-point precision bugs.","Normalize sign so the same slope has one key.","Combine the largest slope count with duplicates of the anchor."],review:"Max Points on a Line is slope counting with gcd normalization from each anchor."},
"LC 224":{signal:"Basic Calculator can scan with current result, sign, and a stack for parenthesized contexts.",complexity:"O(n) time, O(n) space",code:`int calculate(string s) {
    long result = 0;
    long number = 0;
    int sign = 1;
    stack<long> st;

    for (char ch : s) {
        if (isdigit(ch)) {
            number = number * 10 + (ch - '0');
        } else if (ch == '+') {
            result += sign * number;
            number = 0;
            sign = 1;
        } else if (ch == '-') {
            result += sign * number;
            number = 0;
            sign = -1;
        } else if (ch == '(') {
            st.push(result);
            st.push(sign);
            result = 0;
            sign = 1;
        } else if (ch == ')') {
            result += sign * number;
            number = 0;
            result *= st.top();
            st.pop();
            result += st.top();
            st.pop();
        }
    }

    return result + sign * number;
}`,hints:["Keep result for the current parenthesis level.","Keep sign for the next number.","On '(', push previous result and sign.","On ')', finish current level and combine with previous context."],answer:["Scan characters once.","Accumulate multi-digit numbers.","Apply number when an operator or closing parenthesis appears.","Use stack to save result/sign before parentheses."],review:"Basic Calculator is expression scanning with a stack of parenthesis contexts."},
"LC 25":{signal:"Reverse nodes in k-group needs checking a full group before rewiring that group.",complexity:"O(n) time, O(1) space",code:`ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0, head);
    ListNode* groupPrev = &dummy;

    while (true) {
        ListNode* kth = groupPrev;
        for (int i = 0; i < k && kth; ++i) kth = kth->next;
        if (!kth) break;

        ListNode* groupNext = kth->next;
        ListNode* prev = groupNext;
        ListNode* cur = groupPrev->next;

        while (cur != groupNext) {
            ListNode* tmp = cur->next;
            cur->next = prev;
            prev = cur;
            cur = tmp;
        }

        ListNode* oldStart = groupPrev->next;
        groupPrev->next = kth;
        groupPrev = oldStart;
    }

    return dummy.next;
}`,hints:["Use a dummy before head.","Find the kth node before reversing.","If fewer than k nodes remain, stop.","Reverse pointers only within the confirmed group."],answer:["For each group, locate kth node.","Save groupNext.","Reverse until reaching groupNext.","Reconnect previous group to kth and advance groupPrev."],review:"Reverse Nodes in k-Group reverses only complete groups after confirming the kth node exists."},
"LC 124":{signal:"Binary Tree Maximum Path Sum needs a gain returned upward and a separate global best path.",complexity:"O(n) time, O(h) recursion space",code:`int maxPathSum(TreeNode* root) {
    int best = INT_MIN;

    function<int(TreeNode*)> gain = [&](TreeNode* node) {
        if (!node) return 0;
        int left = max(0, gain(node->left));
        int right = max(0, gain(node->right));
        best = max(best, node->val + left + right);
        return node->val + max(left, right);
    };

    gain(root);
    return best;
}`,hints:["A path can split at the current node for the global answer.","But a returned path to the parent can only choose one side.","Ignore negative child gains by clamping to zero.","Initialize best to INT_MIN for all-negative trees."],answer:["DFS returns max gain extendable to parent.","Compute left and right nonnegative gains.","Update global best using node + left + right.","Return node plus the better side."],review:"Maximum Path Sum separates global split path from one-branch upward gain."},
"LC 399":{signal:"Evaluate Division is weighted graph traversal where edge weights are ratios.",complexity:"O(Q * (V + E)) time, O(V + E) space",code:`vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
    unordered_map<string, vector<pair<string,double>>> graph;
    for (int i = 0; i < equations.size(); ++i) {
        string a = equations[i][0], b = equations[i][1];
        double v = values[i];
        graph[a].push_back({b, v});
        graph[b].push_back({a, 1.0 / v});
    }

    vector<double> ans;
    for (auto& q : queries) {
        string src = q[0], dst = q[1];
        if (!graph.count(src) || !graph.count(dst)) {
            ans.push_back(-1.0);
            continue;
        }

        unordered_set<string> seen;
        queue<pair<string,double>> bfs;
        bfs.push({src, 1.0});
        seen.insert(src);
        double value = -1.0;

        while (!bfs.empty()) {
            auto [node, product] = bfs.front();
            bfs.pop();
            if (node == dst) {
                value = product;
                break;
            }
            for (auto& [next, weight] : graph[node]) {
                if (!seen.count(next)) {
                    seen.insert(next);
                    bfs.push({next, product * weight});
                }
            }
        }
        ans.push_back(value);
    }
    return ans;
}`,hints:["Treat variables as graph nodes.","Equation a/b=v gives edge a->b weight v and b->a weight 1/v.","For a query, traverse from numerator to denominator.","Multiply edge weights along the path."],answer:["Build a bidirectional weighted graph.","For each query, BFS/DFS from source.","Carry the product so far.","Return product if target is reached, otherwise -1."],review:"Evaluate Division is weighted graph search with multiplicative path weights."},
"LC 210":{signal:"Course Schedule II asks for a topological order of a directed prerequisite graph.",complexity:"O(V + E) time, O(V + E) space",code:`vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indegree(numCourses, 0);

    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        ++indegree[p[0]];
    }

    queue<int> q;
    for (int c = 0; c < numCourses; ++c) {
        if (indegree[c] == 0) q.push(c);
    }

    vector<int> order;
    while (!q.empty()) {
        int course = q.front();
        q.pop();
        order.push_back(course);
        for (int next : graph[course]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }

    return order.size() == numCourses ? order : vector<int>{};
}`,hints:["Prerequisites form directed edges.","Indegree counts unmet prerequisites.","Start with courses that have zero indegree.","If not all courses are processed, a cycle exists."],answer:["Build graph and indegree array.","Push all zero-indegree courses.","Pop courses and reduce neighbor indegrees.","Return order only if it contains all courses."],review:"Course Schedule II is Kahn's topological sort."},
"LC 909":{signal:"Snakes and Ladders is shortest path on board squares, so use BFS.",complexity:"O(n^2) time, O(n^2) space",code:`int snakesAndLadders(vector<vector<int>>& board) {
    int n = board.size();

    auto get = [&](int square) {
        int quot = (square - 1) / n;
        int rem = (square - 1) % n;
        int row = n - 1 - quot;
        int col = (quot % 2 == 0) ? rem : n - 1 - rem;
        return pair<int,int>{row, col};
    };

    vector<int> dist(n * n + 1, -1);
    queue<int> q;
    q.push(1);
    dist[1] = 0;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();
        if (cur == n * n) return dist[cur];

        for (int move = 1; move <= 6 && cur + move <= n * n; ++move) {
            int next = cur + move;
            auto [r, c] = get(next);
            if (board[r][c] != -1) next = board[r][c];
            if (dist[next] == -1) {
                dist[next] = dist[cur] + 1;
                q.push(next);
            }
        }
    }
    return -1;
}`,hints:["Each square is a graph node.","Each die roll creates edges to up to six next squares.","Snakes/ladders redirect the destination once.","BFS gives minimum number of moves."],answer:["Map square number to board coordinates.","BFS from square 1.","For each roll, apply snake or ladder if present.","Return distance when reaching final square."],review:"Snakes and Ladders is BFS over square numbers with board-coordinate mapping."},
"LC 52":{signal:"N-Queens II counts valid queen placements using columns and diagonals as occupied sets.",complexity:"O(n!) time, O(n) recursion space",code:`int totalNQueens(int n) {
    int ans = 0;
    vector<bool> col(n, false), diag1(2 * n - 1, false), diag2(2 * n - 1, false);

    function<void(int)> dfs = [&](int row) {
        if (row == n) {
            ++ans;
            return;
        }
        for (int c = 0; c < n; ++c) {
            int d1 = row - c + n - 1;
            int d2 = row + c;
            if (col[c] || diag1[d1] || diag2[d2]) continue;
            col[c] = diag1[d1] = diag2[d2] = true;
            dfs(row + 1);
            col[c] = diag1[d1] = diag2[d2] = false;
        }
    };

    dfs(0);
    return ans;
}`,hints:["Place one queen per row.","Track occupied columns.","Track both diagonal families.","Count solutions instead of storing boards."],answer:["Backtrack row by row.","Try each column not under attack.","Mark column and diagonals, recurse, then undo.","Increment count when row reaches n."],review:"N-Queens II is row-by-row backtracking with column and diagonal conflict sets."},
"LC 427":{signal:"Construct Quad Tree recursively compresses a square if all values inside are equal.",complexity:"O(n^2 log n) worst-case time with direct scans, O(log n) recursion space",code:`Node* construct(vector<vector<int>>& grid) {
    function<Node*(int,int,int)> build = [&](int r, int c, int len) -> Node* {
        bool same = true;
        for (int i = r; i < r + len && same; ++i) {
            for (int j = c; j < c + len; ++j) {
                if (grid[i][j] != grid[r][c]) {
                    same = false;
                    break;
                }
            }
        }

        if (same) return new Node(grid[r][c] == 1, true);

        int half = len / 2;
        Node* node = new Node(true, false);
        node->topLeft = build(r, c, half);
        node->topRight = build(r, c + half, half);
        node->bottomLeft = build(r + half, c, half);
        node->bottomRight = build(r + half, c + half, half);
        return node;
    };

    return build(0, 0, grid.size());
}`,hints:["A leaf represents a square region with one value.","If region is mixed, split into four equal quadrants.","Recursively build each quadrant.","The node value is arbitrary for non-leaf nodes."],answer:["Write a recursive build over row, col, length.","Scan the region to see if all values match.","Return leaf if uniform.","Otherwise split into four children."],review:"Quad Tree construction recursively checks uniform regions and splits mixed regions into four quadrants."},
"LC 502":{signal:"IPO uses sorted projects plus a max-heap of currently affordable profits.",complexity:"O(n log n + k log n) time, O(n) space",code:`int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    vector<pair<int,int>> projects;
    for (int i = 0; i < profits.size(); ++i) {
        projects.push_back({capital[i], profits[i]});
    }
    sort(projects.begin(), projects.end());

    priority_queue<int> affordable;
    int i = 0;
    while (k--) {
        while (i < projects.size() && projects[i].first <= w) {
            affordable.push(projects[i].second);
            ++i;
        }
        if (affordable.empty()) break;
        w += affordable.top();
        affordable.pop();
    }

    return w;
}`,hints:["Sort projects by required capital.","As capital grows, push newly affordable profits into a max-heap.","Each round choose the highest profit among affordable projects.","Stop if no project is affordable."],answer:["Pair capital and profit and sort by capital.","Maintain pointer to newly affordable projects.","Use max-heap to choose best affordable profit.","Repeat at most k times."],review:"IPO is greedy selection from currently affordable projects using a max-heap."},
"LC 123":{signal:"At most two stock transactions can be tracked with four rolling states.",complexity:"O(n) time, O(1) space",code:`int maxProfit(vector<int>& prices) {
    int buy1 = INT_MIN, sell1 = 0;
    int buy2 = INT_MIN, sell2 = 0;

    for (int price : prices) {
        buy1 = max(buy1, -price);
        sell1 = max(sell1, buy1 + price);
        buy2 = max(buy2, sell1 - price);
        sell2 = max(sell2, buy2 + price);
    }

    return sell2;
}`,hints:["State after first buy, first sell, second buy, second sell.","Buying costs price, selling gains price.","Second buy can use profit from first sell.","Update states in order for each price."],answer:["Maintain buy1/sell1/buy2/sell2.","For every price, update best state values.","Return sell2 as max profit after at most two transactions."],review:"Stock III compresses two-transaction DP into buy/sell rolling states."},
"LC 188":{signal:"At most k stock transactions is DP over transaction count and holding state.",complexity:"O(kn) time, O(k) space",code:`int maxProfit(int k, vector<int>& prices) {
    int n = prices.size();
    if (n == 0 || k == 0) return 0;

    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; ++i) {
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        }
        return profit;
    }

    vector<int> buy(k + 1, INT_MIN);
    vector<int> sell(k + 1, 0);

    for (int price : prices) {
        for (int t = 1; t <= k; ++t) {
            buy[t] = max(buy[t], sell[t - 1] - price);
            sell[t] = max(sell[t], buy[t] + price);
        }
    }

    return sell[k];
}`,hints:["If k is large, it becomes unlimited transactions.","buy[t] means best state after buying for transaction t.","sell[t] means best state after selling transaction t.","Transition buy from sell[t-1] and sell from buy[t]."],answer:["Handle unlimited-transaction shortcut.","Maintain buy and sell arrays by transaction count.","For each price and transaction count, update buy then sell.","Return sell[k]."],review:"Stock IV generalizes stock DP over transaction count with buy/sell states."}
});
Object.keys(solidSolutionPatches).forEach(id=>{const q=problems.find(p=>p.id===id);if(q)Object.assign(q,solidSolutionPatches[id]);});
const patternSignals={"Array / HashMap":"lookup by value, complement, frequency, grouping key","Sliding Window":"substring/subarray + longest/shortest + at most K","Two Pointers":"sorted array, pair sum, remove duplicates, two-end scan","Binary Search":"O(log n), minimum feasible, maximize minimum, answer space","HashMap / Prefix":"subarray sum + negative numbers, complement, frequency","Stack":"nested structure, next greater, undo, monotonic boundary","Linked List":"fast/slow pointers, cycle, reverse links, dummy node","Tree DFS/BFS":"ancestor bounds, level order, path state, subtree result","Graph":"dependency, shortest path, connected components, cycle","Heap":"top k, streaming median, repeated best candidate","Greedy":"local choice, farthest reach, one-pass optimum, exchange proof","Dynamic Programming":"count ways, max/min value, take/skip, state transition","Matrix":"grid boundary, row/column marker, direction walk, in-place state","Backtracking":"choose, recurse, prune, undo; generate all valid states","Bit Manipulation":"xor cancellation, bit count, masks, shifts, common prefix bits","Math":"formula, gcd/slope, fast power, digit or divisor invariant"};

function note(q){return englishNotes[q.id]||{signal:q.signal,hints:q.hints,review:q.review};}
function splitPrompt(prompt){const parts=String(prompt).split(/\n\s*\n/);return {statement:parts[0]||"",example:parts.slice(1).join("\n\n")};}
function meta(q){return studyMeta[q.id]||{sourceUrl:"https://leetcode.com/problemset/",examples:[],constraints:[]};}
function acceptedPatterns(q){return [...new Set([q.pattern,...(q.secondaryPatterns||[])])];}
function patternLabel(q){return acceptedPatterns(q).join(" / ");}
function isAcceptedPattern(q,opt){return acceptedPatterns(q).includes(opt);}
function patternReason(q,p){return q.patternReasons&&q.patternReasons[p]?q.patternReasons[p]:(p===q.pattern?`Primary teaching pattern: ${p}.`:`Also acceptable when you explain the invariant as ${p}.`);}
function officialPatternCounts(){const official=new Set(officialLc150Ids),counts=Object.fromEntries(patterns.map(p=>[p,0]));problems.filter(q=>official.has(q.id)).forEach(q=>acceptedPatterns(q).forEach(p=>{counts[p]=(counts[p]||0)+1;}));return counts;}
const officialLc150IdSet=new Set(officialLc150Ids);
function neetcode150IdSet(){if(!globalThis.__neetcode150IdSet)globalThis.__neetcode150IdSet=new Set(globalThis.neetcode150Ids||[]);return globalThis.__neetcode150IdSet;}
function sourceBadges(q){const badges=[];if(officialLc150IdSet.has(q.id))badges.push({label:"LC150",cls:"lc150"});if(neetcode150IdSet().has(q.id))badges.push({label:"NeetCode",cls:"neet"});if(q.wave)badges.push({label:q.wave,cls:`wave ${String(q.wave).toLowerCase().replace(/\s+/g,"-")}`});return badges;}
function renderSourceBadges(q){return sourceBadges(q).map(b=>`<span class="source-badge ${esc(b.cls)}">${esc(b.label)}</span>`).join("");}
function renderPatternSignals(){const host=$("patternSignalList");if(!host)return;const counts=officialPatternCounts();host.innerHTML=patterns.map(p=>`<div class="memory-card"><div class="pattern-title"><strong>${esc(p)}</strong><span class="pattern-count" title="${counts[p]||0} official LC150 problems accept this pattern">${counts[p]||0}</span></div><span class="tiny">${esc(patternSignals[p]||"name the invariant and update rule")}</span></div>`).join("");}
function initPatternSignalToggle(){const card=$("patternSignalCard"),btn=$("patternSignalToggle");if(!card||!btn)return;const apply=hidden=>{card.classList.toggle("is-collapsed",hidden);btn.textContent=hidden?"Show":"Hide";btn.setAttribute("aria-pressed",String(hidden));};apply(localStorage.getItem("lc_hidePatternSignals_ext")==="1");btn.addEventListener("click",()=>{const hidden=!card.classList.contains("is-collapsed");localStorage.setItem("lc_hidePatternSignals_ext",hidden?"1":"0");apply(hidden);});}
function renderAcceptedPatternCard(q){const accepted=acceptedPatterns(q);return `<div class="help-card"><strong>Accepted Patterns</strong><p>Primary: ${esc(q.pattern)}</p>${accepted.length>1?`<ul>${accepted.map(p=>`<li><b>${esc(p)}</b>: ${esc(patternReason(q,p))}</li>`).join("")}</ul>`:""}</div>`;}
function renderExamples(items){return `<div class="example-list">${items.map((ex,idx)=>`<div class="example-card"><b>Example ${idx+1}</b><span><em>Input:</em> ${esc(ex.input)}</span><span><em>Output:</em> ${esc(ex.output)}</span>${ex.note?`<span><em>Why:</em> ${esc(ex.note)}</span>`:""}</div>`).join("")}</div>`;}
function renderConstraints(items){return `<ul class="constraint-list">${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;}
function neutralClarifyQuestions(q){const text=`${q.title||""} ${q.prompt||""}`.toLowerCase(),items=["Can the input be empty or at its minimum size?","What are the input size and value limits?","Should I return a value, indices, nodes, or mutate the input?"];if(text.includes("string"))items.push("What characters can appear, and is case significant?");if(text.includes("linked list"))items.push("Can the list be empty or contain one node?");if(text.includes("tree"))items.push("Can the tree be empty, skewed, or contain duplicate values?");if(text.includes("grid")||text.includes("matrix")||text.includes("board"))items.push("Can I mark cells in-place, and which neighbor directions are valid?");if(text.includes("sorted"))items.push("Are duplicates possible, and is the sorted order guaranteed?");if(text.includes("graph")||text.includes("course"))items.push("Are edges directed, weighted, or possibly disconnected?");return items.slice(0,4).join(" / ");}
function renderPrompt(q){const {statement}=splitPrompt(q.prompt),m=meta(q);return `<p class="problem-statement">${esc(statement)}</p><div class="problem-extra"><div><strong>Examples</strong>${renderExamples(m.examples)}</div><div><strong>Constraints</strong>${renderConstraints(m.constraints)}</div>${m.leetcodeFollowUp?`<div class="leetcode-followup"><strong>LeetCode Follow-up</strong><span>${esc(m.leetcodeFollowUp)}</span></div>`:""}<div><strong>Clarify before solving</strong><span>${esc(neutralClarifyQuestions(q))}</span></div><div><strong>Source</strong><a class="source-link" href="${esc(m.sourceUrl)}" target="_blank" rel="noreferrer">Open original LeetCode problem</a></div></div>`;}
function highlightCpp(code){let h=esc(code);h=h.replace(/("(?:\\.|[^"\\])*")/g,'<span class="tok-string">$1</span>');h=h.replace(/\b(class|public|private|return|if|else|for|while|auto|const|void|bool|int|long|string|vector|unordered_map|unordered_set|stack|queue|priority_queue|set|pair|function|true|false|nullptr)\b/g,'<span class="tok-keyword">$1</span>');h=h.replace(/\b(sort|max|min|swap|push|push_back|push_front|pop|pop_back|front|back|count|size|begin|end|erase|insert|substr|move)\b/g,'<span class="tok-fn">$1</span>');h=h.replace(/\b(\d+)\b/g,'<span class="tok-number">$1</span>');return h;}
function renderCodeBlock(title,note,code){return `<div class="code-panel"><div class="code-title"><span>${esc(title)}</span><small>${esc(note)}</small></div><pre class="sublime"><code>${highlightCpp(code)}</code></pre></div>`;}
function codeTemplates(q){const multi=acceptedPatterns(q).length>1,alt=alternativeSolutions[q.id],meta=englishAltMeta[q.id]||[alt&&alt.title||"Alternative Solution",alt&&alt.note||"Use this as a discussion variant."],isSkeleton=(q.code||"").startsWith("// Study skeleton");const entries=[];if(multi&&bruteForceTemplates[q.id])entries.push(bruteForceTemplates[q.id]);entries.push({title:isSkeleton?`Study Skeleton: ${q.pattern}`:`Primary: ${q.pattern}`,note:isSkeleton?`Scaffold for this newly added LC150 problem. Use it to preserve the invariant before writing the final C++ solution. ${q.complexity}`:`Recommended first in interviews. ${q.complexity}`,code:q.code});if(alt)entries.push({title:meta[0],note:meta[1],code:alt.code});if(multi&&patternApproachExtras[q.id])entries.push(...patternApproachExtras[q.id]);const seen=new Set();return entries.filter(entry=>{const key=entry.code.replace(/\s+/g," ").trim();if(seen.has(key))return false;seen.add(key);return true;});}
function renderTemplateSet(q){return codeTemplates(q).map((entry,idx)=>renderCodeBlock(`${idx+1}. ${entry.title}`,entry.note,entry.code)).join("");}
function followupSpoken(q,followup,answer,idx){const openings=[
`I would treat this as a constraint change, not a brand-new problem.`,
`My first move is to name what changed, then keep the original invariant if it still holds.`,
`I would answer by separating the algorithmic idea from the implementation choice.`,
`I would compare the follow-up against the baseline before changing code.`
];const bridges=[
`For ${q.title}, the baseline is ${q.complexity}, so I would explain whether that bound stays the same.`,
`The key is to preserve the ${q.pattern} invariant while changing only the state that the follow-up affects.`,
`I would call out the new edge case first, then show the smallest code change that handles it.`,
`If the constraint changes the data model, I would say that explicitly before discussing complexity.`
];return `${openings[idx%openings.length]} ${answer.takeaway} ${answer.angle} ${bridges[(idx+acceptedPatterns(q).length)%bridges.length]}`;}
function followupAnswer(q,followup,idx){const lower=followup.toLowerCase();let angle="Identify what constraint changed, then decide which data structure, state definition, or traversal strategy must change.";let tradeoff="The core idea usually stays the same; only the implementation detail changes.";let takeaway="Restate the new constraint, then change only the part of the algorithm that constraint touches.";if(lower.includes("sorted")){angle="Use the sorted property to replace lookup with directional movement.";tradeoff="Two pointers can reduce extra memory, but sorting first would change complexity if the input is not already sorted.";takeaway="Sorted input often lets you trade a hashmap for pointer movement.";}else if(lower.includes("heap")&&lower.includes("bucket")){angle="Use the frequency map either way, then choose heap for small k and buckets when linear time is the goal.";tradeoff="Heap gives O(n log k) and small memory pressure for k; bucket sort can be O(n) but allocates buckets by frequency.";takeaway="Heap vs bucket is a selection tradeoff after the same frequency-counting step.";}else if(lower.includes("k is large")||lower.includes("large k")){angle="When k approaches the number of unique values, a heap loses its advantage and bucket sort or sorting becomes more attractive.";tradeoff="Small k favors a min-heap; large k reduces the benefit of maintaining only k candidates.";takeaway="The value of k decides whether bounded selection is still useful.";}else if(lower.includes("duplicate")){angle="Define whether duplicates affect validity, uniqueness, or index identity.";tradeoff="Skipping duplicates is safe for value-based answers, but not always safe when original indices matter.";takeaway="Before handling duplicates, define whether the answer is value-based or index-based.";}else if(lower.includes("unicode")||lower.includes("alphabet")){angle="Replace fixed-size character arrays with hashmap-based counts or explicit normalization.";tradeoff="Arrays are faster for fixed alphabets; hashmaps are safer for unknown character sets.";takeaway="Unknown charset means avoid fixed 26/128-size assumptions.";}else if(lower.includes("return")&&lower.includes("indices")){angle="Track start/end or original indices while running the same algorithm.";tradeoff="The algorithm remains unchanged, but state bookkeeping becomes part of correctness.";takeaway="Returning extra detail usually adds bookkeeping, not a new algorithm.";}else if(lower.includes("bfs")||lower.includes("dfs")){angle="Choose traversal based on depth risk and whether level order matters.";tradeoff="DFS is compact but can hit recursion depth; BFS uses a queue and is safer for very deep structures.";takeaway="Traversal choice should follow the output order and depth risk.";}else if(lower.includes("quickselect")){angle="Use partitioning when average linear time is worth the worst-case risk.";tradeoff="Quickselect is faster on average; heap is steadier and easier for streaming.";takeaway="Quickselect optimizes average time; heap optimizes predictability.";}else if(lower.includes("stream")){angle="Avoid storing or sorting all input; maintain only the state needed for the answer.";tradeoff="Streaming favors heaps, rolling windows, or incremental maps over offline sorting.";takeaway="Streaming constraints usually rule out offline sorting.";}else if(lower.includes("space")||lower.includes("memory")){angle="Name the current memory bottleneck, then try in-place updates or output-array reuse.";tradeoff="Lower memory often makes code less straightforward, so explain the invariant carefully.";takeaway="Space follow-ups are about reusing existing storage without breaking the invariant.";}else if(lower.includes("complexity")){angle="Count how often each pointer, node, edge, or element is processed.";tradeoff="A rigorous Big-O explanation is stronger than simply naming the final complexity.";takeaway="Complexity answers should count movement, not just state the final Big-O.";}else if(lower.includes("thread")){angle="Protect every shared mutation across the map and linked list.";tradeoff="Thread safety adds synchronization overhead but preserves structure consistency.";takeaway="Thread-safety follow-ups protect invariants across every shared mutation.";}const result={angle,tradeoff,takeaway};return {...result,spoken:followupSpoken(q,followup,result,idx)};}
function renderFollowupDetails(q){return `<div class="followup-list">${q.followups.map((f,idx)=>{const a=followupAnswer(q,f,idx);return `<div class="followup-card"><strong>${esc(f)}</strong><div class="followup-takeaway"><span>Takeaway</span><p>${esc(a.takeaway)}</p></div><div class="followup-highlight"><span>Approach</span><p>${esc(a.angle)}</p></div><div class="followup-highlight tradeoff"><span>Tradeoff</span><p>${esc(a.tradeoff)}</p></div><div class="followup-highlight spoken"><span>Spoken answer</span><p>${esc(a.spoken)}</p></div></div>`;}).join("")}</div>`;}
function splitComplexity(text){const s=String(text||"").trim();const lower=s.toLowerCase();const timeMatch=s.match(/O\([^)]+\)(?:\s*(?:average|worst-case|amortized))?/i);const time=timeMatch?timeMatch[0]:"Depends on chosen approach";let space="Depends on implementation";const afterComma=s.split(",").slice(1).join(",").trim();const spaceMatch=s.match(/O\([^)]+\)\s*space/i);if(spaceMatch)space=spaceMatch[0].replace(/\s*space/i,"");else if(afterComma)space=afterComma.replace(/\s*space/i,"");else if(lower.includes("o(1) extra"))space="O(1) extra";return {time,space};}
function baselineComplexity(q){const p=q.pattern;if(p.includes("Binary"))return {time:"O(n)",space:"O(1)",pros:"Simple linear scan baseline; useful before proving the monotonic or sorted-half property.",cons:"Misses the required logarithmic improvement."};if(p.includes("Heap"))return {time:"O(n log n)",space:"O(n)",pros:"Sort-all baseline is easy to reason about.",cons:"Does unnecessary full ordering when only the best k or repeated best candidate is needed."};if(p.includes("Two Pointers"))return {time:"O(n^2)",space:"O(1)",pros:"Directly enumerates pairs or choices and is easy to verify.",cons:"Usually too slow; it ignores the discard rule that makes pointer movement valid."};if(p.includes("Sliding"))return {time:"O(n^2)",space:"O(n)",pros:"Checks each candidate window literally.",cons:"Repeats work instead of maintaining a reusable window invariant."};if(p.includes("Dynamic"))return {time:"Exponential or O(n^2)",space:"O(n)",pros:"Recursion or enumeration clarifies the choices.",cons:"Repeated subproblems make it miss the intended DP state."};if(p.includes("Graph")||p.includes("Tree"))return {time:"O(V + E)",space:"O(V)",pros:"Traversal baseline exposes nodes, edges, and visited state.",cons:"The follow-up usually concerns traversal style, mutation, or recursion depth rather than asymptotic time."};if(p.includes("Matrix"))return {time:"O(mn)",space:"O(mn)",pros:"Extra visited/copy storage is straightforward.",cons:"Many matrix follow-ups ask for in-place or constant-space state encoding."};return {time:"O(n^2)",space:"O(n)",pros:"Straightforward candidate enumeration makes correctness easy to see.",cons:"Repeats work that the final invariant or data structure avoids."};}
function approachComplexityFromNote(note,fallback){const combined=[note||"",fallback||""].join(" ");return splitComplexity(combined.includes("O(")?combined:fallback);}
function secondaryPatternRow(q,p){const c=splitComplexity(q.complexity);return {scenario:`${p} framing`,time:c.time,space:c.space,pros:patternReason(q,p),cons:"Only use this label if you can state the invariant in that pattern's language."};}
function genericComparisonRows(q){const rows=[],base=baselineComplexity(q),primary=splitComplexity(q.complexity),accepted=acceptedPatterns(q);rows.push({scenario:"Brute-force baseline",time:base.time,space:base.space,pros:base.pros,cons:base.cons});rows.push({scenario:`Primary: ${q.pattern}`,time:primary.time,space:primary.space,pros:`Best default for this trainer: ${note(q).review||note(q).signal}`,cons:"Requires explaining the invariant clearly before coding."});accepted.slice(1).forEach(p=>rows.push(secondaryPatternRow(q,p)));if(alternativeSolutions[q.id]){const meta=englishAltMeta[q.id]||["Alternative Solution","Use this as a discussion variant."];const c=approachComplexityFromNote(meta[1],q.complexity);rows.push({scenario:meta[0].replace(/^Alternative:\s*/,"Alternative: "),time:c.time,space:c.space,pros:meta[1],cons:"Good as a follow-up or contrast, but not always the first explanation to lead with."});}if(patternApproachExtras[q.id]){patternApproachExtras[q.id].forEach(entry=>{const c=approachComplexityFromNote(entry.note,q.complexity);rows.push({scenario:entry.title,time:c.time,space:c.space,pros:entry.note,cons:"Use when the interviewer asks for this specific pattern angle."});});}const seen=new Set();return rows.filter(r=>{const key=r.scenario;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,5);}
function followupComparisonRows(q){if(q.id==="LC 347")return [
{scenario:"Sorting baseline",time:"O(n log n)",space:"O(n)",pros:"Simplest to explain after the frequency map; good baseline for correctness.",cons:"Fails the LeetCode follow-up because it is not better than O(n log n)."},
{scenario:"Min-heap of size k",time:"O(n log k)",space:"O(n + k)",pros:"Best interview default when k is small; memory for selected candidates stays bounded by k.",cons:"Still needs the full frequency map; less attractive when k is close to unique count."},
{scenario:"Bucket sort by frequency",time:"O(n)",space:"O(n)",pros:"Directly satisfies the better-than-sorting follow-up; frequency is at most n, so buckets are natural.",cons:"Allocates many buckets and can feel heavier to code under time pressure."},
{scenario:"Quickselect on unique values",time:"Average O(u), worst O(u^2)",space:"O(n)",pros:"Fast on average when working offline, where u is the number of unique values.",cons:"Worst-case risk and partition code are harder to explain than heap or bucket."},
{scenario:"Streaming input",time:"O(n log k) after counts update",space:"O(u + k)",pros:"A heap keeps only the current top candidates once frequencies are maintained.",cons:"Exact top-k still needs frequency state for all unique values; true streaming without full counts is a different approximation problem."}
];return genericComparisonRows(q);}
function renderFollowupComparison(q){const rows=followupComparisonRows(q);if(!rows.length)return "";return `<div class="followup-comparison"><strong>Scenario Comparison</strong><div class="comparison-table-wrap"><table class="comparison-table"><thead><tr><th>Scenario</th><th>Complexity</th><th>Pros</th><th>Cons</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.scenario)}</td><td><span class="complexity-line">Time: ${esc(r.time)}</span><span class="complexity-line">Space: ${esc(r.space)}</span></td><td>${esc(r.pros)}</td><td>${esc(r.cons)}</td></tr>`).join("")}</tbody></table></div></div>`;}
function renderFollowupPanel(q){return `<div class="solution-grid"><div class="solution-card wide"><strong>Follow-up Strategy</strong>${renderFollowupDetails(q)}</div></div>`;}
function renderSolutionNotes(q){return "";}
function watchForItems(q){const id=q.id,patterns=acceptedPatterns(q),m=meta(q),constraints=(m.constraints||[]).join(" ");const items=[];const add=(title,body)=>items.push({title,body});if(id==="LC 11"){add("Move the limiting wall, not a random wall.","For Container With Most Water, width always shrinks. If height[l] is shorter, keeping it while moving r cannot raise the limiting height, so the only useful move is l++.");add("Compute area before moving.","The current pair might be the best one. Record width * min(height[l], height[r]) before discarding either side.");add("Explain the greedy proof out loud.","This is accepted as Two Pointers, but the interviewer usually cares about the greedy discard argument: the shorter wall cannot form a better container with any smaller width.");}else if(id==="LC 53"){add("Initialize from nums[0].","Maximum Subarray breaks if best starts at 0: nums = [-3,-2] should return -2, not 0.");add("Name the DP state precisely.","cur means best subarray sum ending exactly at the current index. That is why the choice is only extend previous or restart at nums[i].");add("Update best after cur changes.","best is global over all endings, so each new cur must be considered immediately.");}else if(id==="LC 200"){add("Mark visited when entering the cell.","For Number of Islands, marking late can push the same land cell multiple times from neighboring cells.");add("Use four directions only.","Diagonal land does not connect islands on LeetCode 200, so the neighbor loop must be up/down/left/right.");add("Ask whether mutation is allowed.","If the grid can be changed, turning visited land into water is clean. If not, use a separate visited matrix.");}else if(id==="LC 347"){add("Frequency count comes before selection.","Top K Frequent is not a heap problem at the first line; the heap only works after the hashmap has produced frequencies.");add("Keep the heap ordered by frequency.","The min-heap should eject the weakest frequency when size exceeds k, not order by numeric value.");add("Mention the follow-up constraint.","LeetCode asks for better than O(n log n), so heap O(n log k) or bucket O(n) is the point of the solution.");}else{if(patterns.some(p=>p.includes("Two Pointers"))){add("Pointer movement must discard impossible candidates.","For this problem, state why moving a pointer cannot skip the optimal answer. If you cannot say that sentence, the two-pointer proof is incomplete.");}if(patterns.some(p=>p.includes("Sliding"))){add("Define the window invariant before coding.","Say exactly what the current window satisfies and when the left boundary is allowed to move.");}if(patterns.some(p=>p.includes("Dynamic"))){add("Write the state in one sentence.","A DP answer is only convincing after the state, transition, and base case are explicit.");}if(patterns.some(p=>p.includes("Graph"))){add("Define nodes, edges, and visited state.","For graph problems, most bugs come from an unclear graph model or revisiting the same node.");}if(patterns.some(p=>p.includes("Tree"))){add("Separate base case from recursive meaning.","Say what null returns, what a leaf means, and whether the recursion carries state down or combines answers up.");}if(patterns.some(p=>p.includes("Heap"))){add("Name the ranking key.","A heap is only useful after you define what is smallest or largest and why it is safe to discard that item.");}if(patterns.some(p=>p.includes("Greedy"))){add("Give the exchange or discard reason.","A local choice needs proof. Explain why the chosen move cannot block a better future answer.");}if(patterns.some(p=>p.includes("Stack"))){add("Explain what the stack top represents.","Stack solutions become readable when push/pop are tied to a pending boundary, nested structure, or monotonic condition.");}if(patterns.some(p=>p.includes("Binary"))){add("State the monotonic predicate.","Binary search is legal only if true/false moves in one direction across the search space.");}if(patterns.some(p=>p.includes("HashMap"))||patterns.some(p=>p.includes("Array"))){add("Protect the lookup meaning.","Be clear whether the map stores counts, last index, first index, or a complement; mixing those meanings causes subtle bugs.");}}if(/10\^5|2 \* 10\^5|10\^4/.test(constraints)){add("Use constraints to justify complexity.","The input size rules out brute force. Say which constraint forces the chosen O(n), O(n log k), or O(log n) approach.");}return items.slice(0,4);}
function renderWatchFor(q){return `<div class="help-card"><strong>What To Watch For</strong><ul>${watchForItems(q).map(x=>`<li><b>${esc(x.title)}</b> ${esc(x.body)}</li>`).join("")}</ul></div>`;}
function codeReadingHelp(q){const n=note(q);return `<div class="help-grid"><div class="help-card help-takeaway"><strong>Read This First</strong><p><mark>${esc(n.review||n.signal)}</mark></p><p>The code is implementing the ${esc(patternLabel(q))} idea. Read each variable as part of preserving that invariant, not as isolated syntax.</p></div>${renderAcceptedPatternCard(q)}<div class="help-card"><strong>Reading Order</strong><ol><li>Start at the return value and ask what final state it represents.</li><li>Find the loop or recursion that updates that state.</li><li>Check the guard conditions that prevent invalid moves, duplicates, or out-of-bound access.</li><li>For multi-pattern problems, compare the baseline, primary approach, and accepted-pattern variants.</li></ol></div>${renderWatchFor(q)}<div class="help-card"><strong>Constraint Discipline</strong><p>A Googler expects you to ask about constraints before committing to the algorithm. Constraints decide whether O(n log n) is acceptable, whether recursion depth is risky, whether mutation is allowed, and whether fixed-size arrays are safe.</p></div></div>`;}
function boundaryChecklist(q){return "Boundary checklist: empty input, single element, duplicates, negative values, overflow risk, no-solution case, and whether input can be mutated. Constraint checklist: input size, value range, sortedness, character set, graph density, recursion depth, and required time/space complexity.";}
function spokenPlan(q){return (q.answer||[]).map((step,i)=>`Step ${i+1}: ${step}`).join(" ");}
function patternSpeech(q){const primary=q.pattern;if(primary.includes("Heap"))return "The heap is only the selection mechanism; I still start by defining the ranking key and what the heap is allowed to discard.";if(primary.includes("Sliding"))return "I would describe the window invariant first, then explain exactly when the left boundary is allowed to move.";if(primary.includes("Two Pointers"))return "I would name what each pointer represents and why every pointer move discards only impossible candidates.";if(primary.includes("Binary"))return "I would state the monotonic predicate, because that is the real reason binary search is legal.";if(primary.includes("Stack"))return "I would explain what the top of the stack means; once that is clear, each push and pop has a purpose.";if(primary.includes("Tree"))return "I would say whether the traversal is carrying state down, combining answers up, or processing one level at a time.";if(primary.includes("Graph"))return "I would define nodes, edges, and visited state before talking about DFS, BFS, or topological order.";if(primary.includes("Linked"))return "I would focus on pointer safety: what moves, what stays reachable, and what terminates the loop.";if(primary.includes("Greedy"))return "I would give the local choice and the reason it cannot block a better future answer.";if(primary.includes("Dynamic"))return "I would define the state in one sentence, then show the transition and base case.";if(primary.includes("Matrix"))return "I would define coordinates, boundaries, and whether the board state can be mutated before writing loops.";if(primary.includes("Backtracking"))return "I would describe the partial candidate, legal choices, pruning rule, and undo step.";if(primary.includes("Bit"))return "I would name what each bit represents, then use xor, masks, shifts, or common-prefix behavior deliberately.";if(primary.includes("Math"))return "I would start from the numeric invariant or formula, then mention overflow and boundary cases.";return "I would make the maintained state explicit, then tie each update back to that state.";}
function interviewerAnswer(q,question,idx){const n=note(q),lower=question.toLowerCase(),step=q.answer[idx]||q.answer[0]||n.review||n.signal;if(lower.includes("brute"))return `My baseline would be the direct enumeration version: try the candidates literally and measure what repeated work appears. Then I would replace that repeated work with ${patternLabel(q)}, keeping the same output contract but making the state reusable.`;if(lower.includes("why"))return `The correctness hinge is: ${n.review||n.signal} I would say that before the code, because it explains why the algorithm is not just trying moves randomly.`;if(lower.includes("complex"))return `For complexity, I would count progress. In this solution each main item or state advances a bounded number of times, which gives ${q.complexity}. I would also mention the extra structure that drives the space cost.`;if(lower.includes("edge")||lower.includes("boundary"))return `I would test the smallest legal input, a case with duplicates or equal values when relevant, a no-answer or empty-answer case if the problem allows it, and a max-size case that stresses ${q.pattern}.`;if(lower.includes("duplicate"))return `I would first ask whether duplicates change the identity of the answer or only the count. If the answer is value-based, I can skip or count duplicates; if it is index-based, I must preserve positions.`;if(lower.includes("stream"))return `For streaming input, I would avoid any step that requires seeing all values first. I would keep only the live summary needed for the answer, such as a heap, rolling counts, or current best state.`;if(lower.includes("heap"))return `I would use the heap only after the ranking key is known. For this problem, the heap keeps the strongest candidates and lets weaker ones fall out without sorting the entire input.`;if(lower.includes("bucket"))return `Bucket sort becomes attractive when the ranking value has a small bounded range, like frequency from 1 to n. It trades heap comparisons for direct placement into frequency buckets.`;if(lower.includes("large"))return `If that parameter gets large, I would re-check whether the optimized structure still helps. For example, when k is close to the number of unique values, full ordering or bucket grouping can be simpler than maintaining a tiny frontier.`;if(lower.includes("sorted"))return `Sorted input changes the available moves: I can often replace lookup or nested search with directional pointer movement, because comparisons tell me which side cannot work.`;if(lower.includes("bfs"))return `BFS is the version I would choose when levels, shortest distance, or iterative depth safety matters. The queue makes the frontier explicit.`;if(lower.includes("dfs"))return `DFS is the version I would choose when the solution is naturally recursive or when I need to carry path state down the structure.`;return `${step} ${patternSpeech(q)} In an interview I would finish that answer by naming the boundary case it protects and how it affects ${q.complexity}.`;}
function renderReciteMode(q){const n=note(q),m=meta(q),constraints=(m.constraints||[]).slice(0,2),clarify=(q.interviewer||[]).slice(0,2).join(" / ");return `<div class="recite-grid"><div class="recite-card checkpoint"><strong>Say This Before Looking</strong><p>In 30 seconds, name the pattern, the invariant, and the complexity. Then open the full Q&A only after you can say it smoothly.</p></div><div class="recite-card"><strong>Prompt</strong><p>${esc(q.title)}: ${esc(splitPrompt(q.prompt).statement)}</p></div><div class="recite-card"><strong>Clarify</strong><p>${esc(clarify||"Ask about input size, empty input, duplicates, mutation, and required complexity.")}</p>${constraints.length?`<ul>${constraints.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}</div><div class="recite-card"><strong>Pattern Signal</strong><p>${esc(n.signal)}</p></div><div class="recite-card"><strong>Invariant</strong><p>${esc(n.review||patternSpeech(q))}</p></div><div class="recite-card"><strong>Complexity</strong><p>${esc(q.complexity)}</p></div></div>`;}
function renderInterviewScript(q){const n=note(q),m=meta(q),constraints=(m.constraints||[]).slice(0,3),followups=(q.followups||[]).slice(0,2);return `<div class="interview-script"><div class="memory-card"><strong>Memorize This Opening</strong><p class="say-line">"Let me first clarify the input, output, and edge cases. Then I will explain a brute force baseline, improve it with ${esc(patternLabel(q))}, and finish with complexity and tests."</p></div><div class="script-row"><span>0:00</span><div><strong>Clarify Out Loud</strong><p class="say-line">"For ${esc(q.title)}, I want to confirm the constraints before choosing the algorithm."</p><ul>${constraints.map(x=>`<li>${esc(x)}</li>`).join("")}<li>Can the input be empty, contain duplicates, or be mutated?</li></ul></div></div><div class="script-row"><span>0:20</span><div><strong>Brute Force Sentence</strong><p class="say-line">"A straightforward solution is to enumerate the possible candidates and compute the answer directly. That is useful as a correctness baseline, but it repeats work and will not meet the constraints."</p></div></div><div class="script-row"><span>0:40</span><div><strong>Pattern Sentence</strong><p class="say-line">"The signal I see is: ${esc(n.signal)} So my main idea is ${esc(patternLabel(q))}."</p>${acceptedPatterns(q).length>1?`<p class="note-line">Primary label: ${esc(q.pattern)}. Also acceptable: ${esc(acceptedPatterns(q).slice(1).join(" / "))}.</p>`:""}</div></div><div class="script-row"><span>1:00</span><div><strong>Algorithm Walkthrough</strong><p class="say-line">"${esc(spokenPlan(q))}"</p></div></div><div class="script-row"><span>1:30</span><div><strong>Correctness Proof Sentence</strong><p class="say-line">"The invariant is: ${esc(n.review||n.signal)} After each step, the state still represents exactly what I need, and every discarded candidate is impossible or no longer needed."</p></div></div><div class="script-row"><span>1:50</span><div><strong>Complexity + Tests</strong><p class="say-line">"The complexity is ${esc(q.complexity)}. I would test empty or minimum input, duplicates, boundary values, and a case that exercises the key invariant."</p></div></div>${followups.length?`<div class="script-row"><span>2:10</span><div><strong>Follow-up Language</strong>${followups.map((f,idx)=>{const a=followupAnswer(q,f,idx);return `<div class="mini-qa"><b>${esc(f)}</b><p class="say-line">"${esc(a.takeaway)} ${esc(a.angle)}"</p></div>`;}).join("")}</div></div>`:""}<div class="self-qa"><strong>Practice Q&A</strong>${q.interviewer.map((qq,idx)=>`<div class="qa-pair"><p class="question">Q${idx+1}. ${esc(qq)}</p><p class="answer">A${idx+1}. ${esc(interviewerAnswer(q,qq,idx))}</p></div>`).join("")}</div></div>`;}
function initTopicFilter(){const sel=$("topicFilter");sel.innerHTML='<option value="all">All topics</option>'+patterns.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join("");}
function saveStats(){localStorage.setItem("lc_score_ext",score);localStorage.setItem("lc_streak_ext",streak);localStorage.setItem("lc_done_ext",done);localStorage.setItem("lc_wrongBank_ext",JSON.stringify(wrongBank));localStorage.setItem("lc_daily_ext",JSON.stringify(dailyStats));}
function scopedProblemPool(){const topic=$("topicFilter")?$("topicFilter").value:"all",wrongOnly=$("hideSolved")&&$("hideSolved").checked;let pool=problems.filter(q=>topic==="all"||acceptedPatterns(q).some(p=>p===topic||p.includes(topic)));if(wrongOnly&&wrongBank.length){const wrongSet=new Set(wrongBank),wrongTitles=new Set(wrongBank.map(key=>reviewProblemFromKey(key)).filter(Boolean).map(q=>q.title));pool=pool.filter(q=>wrongSet.has(q.id)||wrongSet.has(q.title)||wrongTitles.has(q.title));}return pool.length?pool:problems;}
function summarizeDay(day){if(!day)return {total:0,correct:0,wrong:0};if(day.problems){const vals=Object.values(day.problems);const correct=vals.filter(x=>x&&x.correct).length;return {total:vals.length,correct,wrong:vals.length-correct};}return {total:day.total||0,correct:day.correct||0,wrong:day.wrong||0};}
function updateStats(){$("score").textContent=score;$("streak").textContent=streak;$("done").textContent=done;const total=scopedProblemPool().length||1,today=summarizeDay(dailyStats[dateKey()]);$("progress").style.width=`${Math.min(100,(today.total/total)*100)}%`;$("progressText").textContent=`Today ${today.total} / ${total}`;renderReviewList();renderCalendar();}
function reviewProblemFromKey(key){return problems.find(q=>q.id===key)||problems.find(q=>q.title===key);}
function reviewKey(q){return q.id;}
function normalizedReviewKeys(){const seen=new Set(),keys=[];wrongBank.forEach(key=>{const q=reviewProblemFromKey(key),normalized=q?reviewKey(q):key;if(seen.has(normalized))return;seen.add(normalized);keys.push(normalized);});return keys;}
function renderReviewList(){const list=$("reviewList");list.innerHTML="";const unique=normalizedReviewKeys().slice(-12).reverse();if(!unique.length){list.innerHTML='<div class="tiny">No review items yet. Wrong answers will appear here.</div>';return;}unique.forEach(key=>{const q=reviewProblemFromKey(key);const div=document.createElement("div");div.className="review-item";const title=q?`${q.id}. ${q.title}`:key;div.innerHTML=`<strong>${esc(title)}</strong><span>${q?esc(patternLabel(q)):"Review"}</span>`;div.onclick=()=>{if(q)openProblem(q);};list.appendChild(div);});}
function renderNeetRecommendations(){const host=$("neetRecommendations");if(!host)return;const picks=globalThis.neetcodeRecommended||[];if(!picks.length){host.innerHTML='<div class="tiny">More NeetCode picks will appear after the next data wave.</div>';return;}host.innerHTML="";picks.slice(0,12).forEach(item=>{const q=problems.find(p=>p.id===item.id);const div=document.createElement("div");div.className="review-item";div.innerHTML=`<strong>${esc(item.id)}. ${esc(item.title)}</strong><span>${esc(q?`Already added · ${patternLabel(q)}`:item.pattern)}</span>`;div.onclick=()=>{if(q)openProblem(q);};host.appendChild(div);});}
function dateKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
function recordDaily(problemId,correct){const key=dateKey();const prev=dailyStats[key]||{};const day=prev.problems?prev:{problems:{}};day.problems[problemId]={correct,answeredAt:new Date().toISOString()};dailyStats[key]=day;}
function renderCalendar(){const grid=$("calendarGrid"),monthLabel=$("calendarMonth"),summary=$("calendarSummary");if(!grid||!monthLabel||!summary)return;const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();monthLabel.textContent=`${monthNames[month]} ${year}`;grid.innerHTML="";const todayKey=dateKey(),today=summarizeDay(dailyStats[todayKey]);summary.textContent=today.total?`Today ${today.total} unique answered, ${today.correct} correct`:"No answers today yet";const first=new Date(year,month,1),days=new Date(year,month+1,0).getDate();for(let i=0;i<first.getDay();i++){const blank=document.createElement("div");blank.className="calendar-day is-empty";grid.appendChild(blank);}for(let day=1;day<=days;day++){const key=dateKey(new Date(year,month,day)),data=summarizeDay(dailyStats[key]);const accuracy=data.total?Math.round((data.correct/data.total)*100):0;const level=!data.total?0:data.total>=8?4:data.total>=5?3:data.total>=3?2:1;const cell=document.createElement("div");cell.className=`calendar-day ${data.total?"has-work":""} ${key===todayKey?"is-today":""} ${level?`level-${level}`:""}`;cell.title=data.total?`${key}: ${data.total} unique answered, ${data.correct} correct, ${accuracy}% accuracy`:`${key}: no answers`;cell.innerHTML=`<span class="day-number">${day}</span><span class="day-score">${data.total?`${data.correct}/${data.total}`:""}</span>`;grid.appendChild(cell);}}
function applyFilter(){const topic=$("topicFilter").value,wrongOnly=$("hideSolved").checked;filtered=problems.filter(q=>topic==="all"||acceptedPatterns(q).some(p=>p===topic||p.includes(topic)));if(wrongOnly&&wrongBank.length){const wrongSet=new Set(wrongBank),wrongTitles=new Set(wrongBank.map(key=>reviewProblemFromKey(key)).filter(Boolean).map(q=>q.title));filtered=filtered.filter(q=>wrongSet.has(q.id)||wrongSet.has(q.title)||wrongTitles.has(q.title));}if(!filtered.length)filtered=[...problems];filtered=shuffle(filtered);current=0;renderQuestion();}
function getOptionsForQuestion(q){if(!optionSets[q.id]){const accepted=acceptedPatterns(q);const distractors=patterns.filter(p=>!accepted.includes(p));optionSets[q.id]=shuffle([...accepted,...shuffle(distractors).slice(0,Math.max(0,6-accepted.length))]);}return optionSets[q.id];}
const explainPanels=["hintBox","answerBox","templateBox","comparisonBox","followupBox","reciteBox","interviewBox"];
function resetExplanation(){if($("explainShell"))$("explainShell").classList.add("hidden");explainPanels.forEach(id=>{const box=$(id);if(box)box.className="box";});}
function setExplainPanel(panelId){explainPanels.forEach(id=>{const box=$(id);if(box)box.classList.toggle("active",id===panelId&&box.classList.contains("show"));});}
function revealPanel(panelId){const shell=$("explainShell");if(shell)shell.classList.remove("hidden");setExplainPanel(panelId);}
function renderQuestion(){selected=false;hintCount=0;const q=filtered[current%filtered.length];if($("sourceTags"))$("sourceTags").innerHTML=renderSourceBadges(q);$("questionIndex").textContent=`${q.id} · Question ${current+1}`;$("difficulty").textContent=q.difficulty;$("difficulty").className=`difficulty ${q.difficulty.toLowerCase()}`;$("title").textContent=q.title;$("description").innerHTML=renderPrompt(q);$("feedback").className="feedback";$("feedback").innerHTML="";resetExplanation();$("hints").innerHTML="";$("answerText").innerHTML="";$("templateText").innerHTML="";$("comparisonText").innerHTML="";$("followupText").innerHTML="";$("reciteText").innerHTML="";$("interviewQuestions").innerHTML="";$("hintBtn").disabled=activeMode==="drill";$("answerBtn").disabled=activeMode==="drill";$("followupBtn").disabled=activeMode==="drill";$("reciteBtn").disabled=activeMode==="drill";$("interviewBtn").disabled=activeMode==="drill";const finalOptions=getOptionsForQuestion(q);const optionsEl=$("options");optionsEl.innerHTML="";finalOptions.forEach(opt=>{const btn=document.createElement("button");btn.className="option";btn.textContent=opt;btn.onclick=()=>choosePattern(btn,opt);optionsEl.appendChild(btn);});if(activeMode==="solve"){autoUnlock();showHint();}if(activeMode==="interview"){autoUnlock();showInterview();}updateStats();}
function autoUnlock(){selected=true;const q=filtered[current%filtered.length],n=note(q),accepted=acceptedPatterns(q);document.querySelectorAll(".option").forEach(b=>{if(accepted.includes(b.textContent))b.classList.add("correct")});$("hintBtn").disabled=false;$("answerBtn").disabled=false;$("followupBtn").disabled=false;$("reciteBtn").disabled=false;$("interviewBtn").disabled=false;$("feedback").className="feedback show good";$("feedback").innerHTML=`<strong>Accepted patterns:</strong> ${esc(patternLabel(q))}<br>${esc(n.signal)}`;}
function choosePattern(btn,opt){if(selected)return;selected=true;const q=filtered[current%filtered.length],n=note(q),accepted=acceptedPatterns(q);const isCorrect=isAcceptedPattern(q,opt);document.querySelectorAll(".option").forEach(b=>{if(accepted.includes(b.textContent))b.classList.add("correct")});done++;recordDaily(q.id,isCorrect);if(isCorrect){score++;streak++;btn.classList.add("correct");wrongBank=wrongBank.filter(x=>x!==q.id&&x!==q.title);$("feedback").className="feedback show good";$("feedback").innerHTML=`<strong>Correct: ${esc(opt)} is accepted.</strong><br><strong>Primary:</strong> ${esc(q.pattern)}<br>${esc(patternReason(q,opt))}<br>${esc(n.signal)}`;}else{streak=0;btn.classList.add("wrong");wrongBank.push(reviewKey(q));$("feedback").className="feedback show bad";$("feedback").innerHTML=`<strong>Better fit: ${esc(patternLabel(q))}</strong><br>${accepted.map(p=>`${esc(p)}: ${esc(patternReason(q,p))}`).join("<br>")}<br>${esc(n.signal)}`;}$("hintBtn").disabled=false;$("answerBtn").disabled=false;$("followupBtn").disabled=false;$("reciteBtn").disabled=false;$("interviewBtn").disabled=false;saveStats();updateStats();}
function showHint(){const q=filtered[current%filtered.length],n=note(q);$("hintBox").classList.add("show");if(hintCount<n.hints.length){const div=document.createElement("div");div.className="hint-step";div.innerHTML=`<strong>Hint ${hintCount+1}</strong><p>${esc(n.hints[hintCount])}</p><small>${hintCount===0?"Start with brute force, then name the bottleneck.":hintCount===1?"State the data structure or invariant clearly.":hintCount===2?"Before coding, define pointer/state updates.":"Finish with boundary cases and complexity."}</small>`;$("hints").appendChild(div);hintCount++;}revealPanel("hintBox");if(hintCount>=n.hints.length)$("hintBtn").disabled=true;}
function showAnswer(){const q=filtered[current%filtered.length],comparison=renderFollowupComparison(q);$("answerBox").classList.add("show");$("templateBox").classList.add("show");$("comparisonBox").classList.toggle("show",!!comparison);$("answerText").innerHTML=codeReadingHelp(q);$("templateText").innerHTML=renderTemplateSet(q);$("comparisonText").innerHTML=comparison;revealPanel("answerBox");}
function ensureCodeRendered(){const q=filtered[current%filtered.length];if(!$("templateText").innerHTML)$("templateText").innerHTML=renderTemplateSet(q);$("templateBox").classList.add("show");}
function showFollowups(){const q=filtered[current%filtered.length];$("followupBox").classList.add("show");$("followupText").innerHTML=renderFollowupPanel(q);revealPanel("followupBox");}
function showRecite(){const q=filtered[current%filtered.length];$("reciteBox").classList.add("show");$("reciteText").innerHTML=renderReciteMode(q);revealPanel("reciteBox");}
function showInterview(){const q=filtered[current%filtered.length];$("interviewBox").classList.add("show");$("interviewQuestions").innerHTML=renderInterviewScript(q);$("interviewBtn").disabled=true;revealPanel("interviewBox");}
function nextQuestion(){current=(current+1)%filtered.length;renderQuestion();}
function setMode(mode){activeMode=mode;document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.mode===mode));const isLibrary=mode==="library";$("mainPanel").classList.toggle("hidden",isLibrary);$("libraryPanel").classList.toggle("hidden",!isLibrary);if(isLibrary)renderLibrary();else renderQuestion();}
function renderLibrary(){const q=($("librarySearch").value||"").toLowerCase().trim();const list=$("libraryList");list.innerHTML="";problems.filter(p=>{const n=note(p);const blob=`${p.id} ${p.title} ${p.source||""} ${p.wave||""} ${sourceBadges(p).map(b=>b.label).join(" ")} ${patternLabel(p)} ${n.signal} ${p.interviewer.join(" ")} ${p.followups.join(" ")}`.toLowerCase();return !q||blob.includes(q);}).forEach(p=>{const n=note(p);const div=document.createElement("div");div.className="library-item";div.innerHTML=`<strong>${esc(p.id)} · ${esc(p.title)}</strong><span>${esc(patternLabel(p))} · ${esc(p.difficulty)}${p.source?` · ${esc(p.source)}`:""}${p.wave?` · ${esc(p.wave)}`:""} · ${esc(p.complexity)}</span><p class="tiny">${esc(n.review)}</p>`;div.onclick=()=>openProblem(p);list.appendChild(div);});if(!list.innerHTML)list.innerHTML='<div class="tiny">No matching problems.</div>';}
function problemSearchMatches(query){const q=query.toLowerCase().trim();if(!q)return [];return problems.filter(p=>{const n=note(p);const blob=`${p.id} ${p.title} ${p.source||""} ${p.wave||""} ${sourceBadges(p).map(b=>b.label).join(" ")} ${patternLabel(p)} ${p.difficulty} ${n.signal} ${n.review}`.toLowerCase();return blob.includes(q);}).slice(0,8);}
function openProblem(q){const pool=scopedProblemPool();filtered=pool.includes(q)?pool:[q,...pool.filter(p=>p.id!==q.id)];current=Math.max(0,filtered.findIndex(p=>p.id===q.id));activeMode="drill";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.mode==="drill"));$("mainPanel").classList.remove("hidden");$("libraryPanel").classList.add("hidden");renderQuestion();}
function renderProblemSearch(){const input=$("problemSearch"),box=$("problemSearchResults");if(!input||!box)return;const matches=problemSearchMatches(input.value);box.innerHTML="";box.classList.toggle("show",Boolean(input.value.trim()));if(!matches.length){box.innerHTML='<div class="tiny">No matching problems.</div>';return;}matches.forEach(q=>{const btn=document.createElement("button");btn.type="button";btn.className="problem-search-item";btn.innerHTML=`<strong>${esc(q.id)}. ${esc(q.title)}</strong><span>${esc(patternLabel(q))} · ${esc(q.difficulty)}</span>`;btn.onclick=()=>{input.value=`${q.id}. ${q.title}`;box.classList.remove("show");openProblem(q);};box.appendChild(btn);});}
function initTheme(){const btn=$("themeToggle"),label=$("themeToggleText");if(!btn)return;const apply=theme=>{const isDark=theme==="dark";document.documentElement.dataset.theme=theme;btn.classList.toggle("is-dark",isDark);btn.setAttribute("aria-pressed",String(isDark));btn.setAttribute("aria-label",isDark?"Switch to light mode":"Switch to dark mode");if(label)label.textContent=isDark?"Light mode":"Dark mode";};const animateSwitch=()=>{btn.classList.remove("is-animating");void btn.offsetWidth;btn.classList.add("is-animating");setTimeout(()=>btn.classList.remove("is-animating"),520);};const saved=localStorage.getItem("lc_theme_ext")||"light";apply(saved);btn.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";localStorage.setItem("lc_theme_ext",next);animateSwitch();apply(next);});}
function bind(){initTheme();initTopicFilter();renderPatternSignals();initPatternSignalToggle();renderNeetRecommendations();$("hintBtn").addEventListener("click",showHint);$("answerBtn").addEventListener("click",showAnswer);$("followupBtn").addEventListener("click",showFollowups);$("reciteBtn").addEventListener("click",showRecite);$("interviewBtn").addEventListener("click",showInterview);$("nextBtn").addEventListener("click",nextQuestion);$("topicFilter").addEventListener("change",applyFilter);$("hideSolved").addEventListener("change",applyFilter);$("librarySearch").addEventListener("input",renderLibrary);if($("problemSearch")){$("problemSearch").addEventListener("input",renderProblemSearch);$("problemSearch").addEventListener("focus",renderProblemSearch);document.addEventListener("click",event=>{const input=$("problemSearch"),box=$("problemSearchResults");if(input&&box&&!input.contains(event.target)&&!box.contains(event.target))box.classList.remove("show");});}$("calendarPrev").addEventListener("click",()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);renderCalendar();});$("calendarNext").addEventListener("click",()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);renderCalendar();});document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>setMode(t.dataset.mode)));if(location.hash==="#library")setMode("library");else{filtered=shuffle(problems);renderQuestion();}}
document.addEventListener("DOMContentLoaded",bind);
