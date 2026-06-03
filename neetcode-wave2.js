(() => {
const existing=new Set(problems.map(p=>p.id));
const add=[
{id:"LC 518",title:"Coin Change II",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given coins and amount, return the number of combinations that make up amount. Coins can be used unlimited times.",signal:"Counting combinations with unlimited coins is 1D DP over amount, iterating coins outside to avoid permutation counting.",hints:["dp[x] means combinations to make amount x.","dp[0] = 1 because one way makes zero: choose nothing.","Iterate coins outside, amount inside increasing.","Increasing amount allows reusing the same coin."],interviewer:["Why coin loop outside?","Why dp[0] = 1?","How do you avoid counting permutations?","What is complexity?"],answer:["Initialize dp[0] = 1.","For each coin, update dp[x] += dp[x - coin] for x from coin to amount.","Coin-first order counts combinations, not orderings.","Return dp[amount]."],complexity:"O(amount * coins) time, O(amount) space",code:`int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    for (int coin : coins) {
        for (int x = coin; x <= amount; ++x) {
            dp[x] += dp[x - coin];
        }
    }
    return dp[amount];
}`,followups:["What if coin order mattered?","Can you write the 2D DP?","Why does increasing amount allow unlimited coins?"],review:"Coin Change II counts combinations by processing coin types one at a time."},
{id:"LC 40",title:"Combination Sum II",difficulty:"Medium",pattern:"Backtracking",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given candidates that may contain duplicates, return unique combinations where each number is used at most once and sums to target.",signal:"Unique combinations from duplicate candidates means sort first and skip same-depth duplicates.",hints:["Sort candidates so duplicates are adjacent.","At one recursion depth, use a duplicate value only once.","Move i + 1 because each number can be used once.","Stop exploring when candidate exceeds remaining target."],interviewer:["Why sort?","What duplicate are you skipping?","Why recurse with i + 1?","How do you prune?"],answer:["Sort candidates.","DFS from a start index with remaining target.","Skip candidates[i] if it equals candidates[i-1] at the same depth.","Choose candidate, recurse with i+1, then undo."],complexity:"O(2^n * n) time, O(n) recursion space excluding output",code:`vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int,int)> dfs = [&](int start, int remain) {
        if (remain == 0) { ans.push_back(path); return; }
        for (int i = start; i < candidates.size(); ++i) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > remain) break;
            path.push_back(candidates[i]);
            dfs(i + 1, remain - candidates[i]);
            path.pop_back();
        }
    };
    dfs(0, target);
    return ans;
}`,followups:["How is this different from Combination Sum I?","Can a set remove duplicates afterward?","What if candidates are all unique?"],review:"Combination Sum II is sorted backtracking with same-depth duplicate skipping."},
{id:"LC 543",title:"Diameter of Binary Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given a binary tree root, return the diameter length in edges.",signal:"Diameter at a node is left height plus right height; DFS returns height and updates global best.",hints:["The longest path may not pass through root.","Each node can be the highest turning point of a path.","DFS should return height to parent.","Update answer with leftHeight + rightHeight."],interviewer:["What does DFS return?","Why update global answer separately?","Are we counting nodes or edges?","What is complexity?"],answer:["DFS returns the height of a subtree in nodes or edges consistently.","At each node, compute left and right heights.","Update diameter with left + right.","Return 1 + max(left, right)."],complexity:"O(n) time, O(h) space",code:`int diameterOfBinaryTree(TreeNode* root) {
    int best = 0;
    function<int(TreeNode*)> height = [&](TreeNode* node) {
        if (!node) return 0;
        int left = height(node->left);
        int right = height(node->right);
        best = max(best, left + right);
        return 1 + max(left, right);
    };
    height(root);
    return best;
}`,followups:["Return the actual path?","Why not compute height repeatedly?","How does skewed tree affect recursion?"],review:"Diameter DFS returns height upward and records split path locally."},
{id:"LC 110",title:"Balanced Binary Tree",difficulty:"Easy",pattern:"Tree DFS/BFS",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given a binary tree, determine whether it is height-balanced.",signal:"Balanced check needs subtree heights and early failure when height difference exceeds one.",hints:["A subtree is balanced if both children are balanced and heights differ by at most one.","DFS can return height.","Use -1 as a sentinel for unbalanced.","Propagate -1 upward immediately."],interviewer:["What does your helper return?","How do you avoid recomputing heights?","What is the empty tree height?","What is complexity?"],answer:["Write height(node) returning -1 if unbalanced.","Get left and right heights.","If either is -1 or their difference exceeds one, return -1.","Otherwise return 1 + max(left,right)."],complexity:"O(n) time, O(h) space",code:`bool isBalanced(TreeNode* root) {
    function<int(TreeNode*)> height = [&](TreeNode* node) {
        if (!node) return 0;
        int left = height(node->left);
        if (left == -1) return -1;
        int right = height(node->right);
        if (right == -1 || abs(left - right) > 1) return -1;
        return 1 + max(left, right);
    };
    return height(root) != -1;
}`,followups:["Can you return pair<bool,int>?","What is the naive O(n^2) version?","Does balance depend on BST order?"],review:"Balanced Binary Tree combines height computation with early failure."},
{id:"LC 131",title:"Palindrome Partitioning",difficulty:"Medium",pattern:"Backtracking",secondaryPatterns:["Dynamic Programming"],source:"NeetCode Complement",wave:"Wave 2",prompt:"Given a string s, return all ways to partition it so every substring is a palindrome.",signal:"Partition all valid substrings means backtracking; palindrome checks can be precomputed by DP.",hints:["Each recursion chooses the next substring starting at index start.","Only choose it if it is a palindrome.","When start reaches n, record the path.","Precompute palindrome table to avoid repeated checks."],interviewer:["What is the recursion state?","How do you test palindrome efficiently?","Why is output exponential?","Can DP help?"],answer:["Precompute pal[l][r].","DFS from start index.","For every end >= start, choose s[start..end] if palindromic.","Record path when start == n."],complexity:"O(n^2 + output) time, O(n^2) space",code:`vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<bool>> pal(n, vector<bool>(n, false));
    for (int len = 1; len <= n; ++len)
        for (int l = 0; l + len <= n; ++l) {
            int r = l + len - 1;
            pal[l][r] = s[l] == s[r] && (len <= 2 || pal[l + 1][r - 1]);
        }
    vector<vector<string>> ans;
    vector<string> path;
    function<void(int)> dfs = [&](int start) {
        if (start == n) { ans.push_back(path); return; }
        for (int end = start; end < n; ++end) {
            if (!pal[start][end]) continue;
            path.push_back(s.substr(start, end - start + 1));
            dfs(end + 1);
            path.pop_back();
        }
    };
    dfs(0);
    return ans;
}`,followups:["Can you check palindrome on the fly?","How many partitions can exist?","How does this relate to Palindromic Substrings?"],review:"Palindrome Partitioning is backtracking over palindromic cuts."},
{id:"LC 152",title:"Maximum Product Subarray",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given nums, return the largest product of any contiguous subarray.",signal:"Negative numbers can flip min into max, so track both max product ending here and min product ending here.",hints:["A negative number swaps best and worst products.","Track maxEnding and minEnding.","At each x, either start at x or extend previous products.","Update global best each step."],interviewer:["Why track minimum product?","How do zeros behave?","How is this different from max subarray sum?","What is complexity?"],answer:["Maintain hi and lo products ending at current index.","For each x, compute candidates x, hi*x, lo*x.","New hi is max candidate; new lo is min candidate.","Update answer with hi."],complexity:"O(n) time, O(1) space",code:`int maxProduct(vector<int>& nums) {
    int hi = nums[0], lo = nums[0], best = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        int x = nums[i];
        int a = hi * x, b = lo * x;
        hi = max(x, max(a, b));
        lo = min(x, min(a, b));
        best = max(best, hi);
    }
    return best;
}`,followups:["Can prefix/suffix solve it?","Why do zeros reset naturally?","Can you return indices?"],review:"Maximum Product Subarray tracks both extremes because signs flip."},
{id:"LC 213",title:"House Robber II",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 2",prompt:"Houses are in a circle. Return the maximum amount you can rob without robbing adjacent houses.",signal:"Circle breaks normal House Robber into two linear cases: exclude first or exclude last.",hints:["First and last houses are adjacent.","You cannot take both.","Run linear robber on [0..n-2] and [1..n-1].","Take the maximum of the two cases."],interviewer:["Why split into two cases?","What if there is one house?","What is the linear robber state?","Can space be O(1)?"],answer:["Handle n == 1.","Define robRange(l,r) with rolling take/skip states.","Compute max excluding last and excluding first.","Return max of both."],complexity:"O(n) time, O(1) space",code:`int rob(vector<int>& nums) {
    if (nums.size() == 1) return nums[0];
    auto robRange = [&](int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; ++i) {
            int cur = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    };
    return max(robRange(0, nums.size() - 2), robRange(1, nums.size() - 1));
}`,followups:["How does House Robber III differ?","Can you reconstruct chosen houses?","Why not greedily take large houses?"],review:"House Robber II removes the circular conflict by solving two lines."},
{id:"LC 1143",title:"Longest Common Subsequence",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given two strings, return the length of their longest common subsequence.",signal:"Two-string subsequence matching is 2D DP over prefixes.",hints:["dp[i][j] means LCS length for first i chars of text1 and first j chars of text2.","If chars match, extend dp[i-1][j-1].","Otherwise take max of dropping one char from either string.","Return dp[m][n]."],interviewer:["What does dp[i][j] mean?","Why use prefixes?","Can space be reduced?","How is subsequence different from substring?"],answer:["Build a (m+1)*(n+1) table.","For each pair of prefix lengths, compare last chars.","Match adds one to diagonal; mismatch takes max top/left.","Return bottom-right."],complexity:"O(mn) time, O(mn) space",code:`int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; ++i)
        for (int j = 1; j <= n; ++j)
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}`,followups:["Can you recover the sequence?","Can you reduce to O(n) space?","How is edit distance related?"],review:"LCS is 2D prefix DP with match-or-skip transitions."},
{id:"LC 416",title:"Partition Equal Subset Sum",difficulty:"Medium",pattern:"Dynamic Programming",source:"NeetCode Complement",wave:"Wave 2",prompt:"Given nums, return whether it can be partitioned into two subsets with equal sum.",signal:"Equal partition reduces to subset sum target total/2.",hints:["If total sum is odd, impossible.","Target is total / 2.","Use 0/1 knapsack boolean DP.","Iterate sums backward so each number is used once."],interviewer:["Why target total/2?","Why iterate backward?","What is dp[s]?","What if numbers are large?"],answer:["Compute total and reject odd sums.","Set dp[0] = true.","For each num, update possible sums from target down to num.","Return dp[target]."],complexity:"O(n * sum) time, O(sum) space",code:`bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2) return false;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int x : nums)
        for (int s = target; s >= x; --s)
            dp[s] = dp[s] || dp[s - x];
    return dp[target];
}`,followups:["Can bitset optimize it?","Why not greedy?","How does this relate to Target Sum?"],review:"Partition Equal Subset Sum is 0/1 subset-sum DP."}
];
problems.push(...add.filter(p=>!existing.has(p.id)));
Object.assign(studyMeta,{
"LC 518":{sourceUrl:"https://leetcode.com/problems/coin-change-ii/",examples:[{input:"amount = 5, coins = [1,2,5]",output:"4"},{input:"amount = 3, coins = [2]",output:"0"}],constraints:["1 <= coins.length <= 300","0 <= amount <= 5000","1 <= coins[i] <= 5000"]},
"LC 40":{sourceUrl:"https://leetcode.com/problems/combination-sum-ii/",examples:[{input:"candidates = [10,1,2,7,6,1,5], target = 8",output:"[[1,1,6],[1,2,5],[1,7],[2,6]]"},{input:"candidates = [2,5,2,1,2], target = 5",output:"[[1,2,2],[5]]"}],constraints:["1 <= candidates.length <= 100","1 <= candidates[i] <= 50","1 <= target <= 30"]},
"LC 543":{sourceUrl:"https://leetcode.com/problems/diameter-of-binary-tree/",examples:[{input:"root = [1,2,3,4,5]",output:"3"},{input:"root = [1,2]",output:"1"}],constraints:["1 <= number of nodes <= 10^4","-100 <= Node.val <= 100"]},
"LC 110":{sourceUrl:"https://leetcode.com/problems/balanced-binary-tree/",examples:[{input:"root = [3,9,20,null,null,15,7]",output:"true"},{input:"root = [1,2,2,3,3,null,null,4,4]",output:"false"}],constraints:["0 <= number of nodes <= 5000","-10^4 <= Node.val <= 10^4"]},
"LC 131":{sourceUrl:"https://leetcode.com/problems/palindrome-partitioning/",examples:[{input:'s = "aab"',output:'[["a","a","b"],["aa","b"]]'},{input:'s = "a"',output:'[["a"]]'}],constraints:["1 <= s.length <= 16","s contains only lowercase English letters."]},
"LC 152":{sourceUrl:"https://leetcode.com/problems/maximum-product-subarray/",examples:[{input:"nums = [2,3,-2,4]",output:"6"},{input:"nums = [-2,0,-1]",output:"0"}],constraints:["1 <= nums.length <= 2 * 10^4","-10 <= nums[i] <= 10"]},
"LC 213":{sourceUrl:"https://leetcode.com/problems/house-robber-ii/",examples:[{input:"nums = [2,3,2]",output:"3"},{input:"nums = [1,2,3,1]",output:"4"}],constraints:["1 <= nums.length <= 100","0 <= nums[i] <= 1000"]},
"LC 1143":{sourceUrl:"https://leetcode.com/problems/longest-common-subsequence/",examples:[{input:'text1 = "abcde", text2 = "ace"',output:"3"},{input:'text1 = "abc", text2 = "def"',output:"0"}],constraints:["1 <= text1.length, text2.length <= 1000","text1 and text2 consist of lowercase English letters."]},
"LC 416":{sourceUrl:"https://leetcode.com/problems/partition-equal-subset-sum/",examples:[{input:"nums = [1,5,11,5]",output:"true"},{input:"nums = [1,2,3,5]",output:"false"}],constraints:["1 <= nums.length <= 200","1 <= nums[i] <= 100"]}
});
Object.assign(alternativeSolutions,{
"LC 518":{title:"Alternative: 2D DP",note:"O(coins * amount) time and space; explicit include/exclude state.",code:`int change(int amount, vector<int>& coins) {
    int n = coins.size();
    vector<vector<int>> dp(n + 1, vector<int>(amount + 1, 0));
    for (int i = 0; i <= n; ++i) dp[i][0] = 1;
    for (int i = 1; i <= n; ++i)
        for (int a = 1; a <= amount; ++a) {
            dp[i][a] = dp[i - 1][a];
            if (a >= coins[i - 1]) dp[i][a] += dp[i][a - coins[i - 1]];
        }
    return dp[n][amount];
}`},
"LC 40":{title:"Alternative: Include/Exclude Recursion",note:"Same exponential output size; groups duplicate values before branching.",code:`vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> ans; vector<int> path;
    function<void(int,int)> dfs = [&](int i, int remain) {
        if (remain == 0) { ans.push_back(path); return; }
        if (i == candidates.size() || remain < 0) return;
        int j = i;
        while (j < candidates.size() && candidates[j] == candidates[i]) j++;
        dfs(j, remain);
        for (int k = i; k < j && remain >= candidates[i] * (k - i + 1); ++k) {
            path.push_back(candidates[i]);
            dfs(j, remain - candidates[i] * (k - i + 1));
        }
        for (int k = i; k < j; ++k) if (!path.empty() && path.back() == candidates[i]) path.pop_back();
    };
    dfs(0, target);
    return ans;
}`},
"LC 543":{title:"Alternative: Return Height And Diameter",note:"O(n) time without a global variable.",code:`int diameterOfBinaryTree(TreeNode* root) {
    function<pair<int,int>(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return pair<int,int>{0, 0};
        auto [lh, ld] = dfs(node->left);
        auto [rh, rd] = dfs(node->right);
        return pair<int,int>{1 + max(lh, rh), max({ld, rd, lh + rh})};
    };
    return dfs(root).second;
}`},
"LC 110":{title:"Alternative: Pair Return",note:"O(n) time; explicit balanced flag plus height.",code:`bool isBalanced(TreeNode* root) {
    function<pair<bool,int>(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return pair<bool,int>{true, 0};
        auto [lb, lh] = dfs(node->left);
        auto [rb, rh] = dfs(node->right);
        return pair<bool,int>{lb && rb && abs(lh - rh) <= 1, 1 + max(lh, rh)};
    };
    return dfs(root).first;
}`},
"LC 131":{title:"Alternative: On-The-Fly Palindrome Check",note:"Less memory, but repeated palindrome checks can cost more.",code:`vector<vector<string>> partition(string s) {
    vector<vector<string>> ans; vector<string> path;
    auto isPal = [&](int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    };
    function<void(int)> dfs = [&](int start) {
        if (start == s.size()) { ans.push_back(path); return; }
        for (int end = start; end < s.size(); ++end) if (isPal(start, end)) {
            path.push_back(s.substr(start, end - start + 1));
            dfs(end + 1);
            path.pop_back();
        }
    };
    dfs(0);
    return ans;
}`},
"LC 152":{title:"Alternative: Prefix And Suffix Products",note:"O(n) time, O(1) space. Zeros reset product naturally.",code:`int maxProduct(vector<int>& nums) {
    int best = nums[0], pref = 1, suff = 1, n = nums.size();
    for (int i = 0; i < n; ++i) {
        pref = (pref == 0 ? 1 : pref) * nums[i];
        suff = (suff == 0 ? 1 : suff) * nums[n - 1 - i];
        best = max(best, max(pref, suff));
    }
    return best;
}`},
"LC 213":{title:"Alternative: DP Array For Each Case",note:"O(n) time and space; clearer before rolling-state optimization.",code:`int rob(vector<int>& nums) {
    if (nums.size() == 1) return nums[0];
    auto solve = [&](int l, int r) {
        vector<int> dp(r - l + 3, 0);
        for (int i = l; i <= r; ++i) {
            int idx = i - l + 2;
            dp[idx] = max(dp[idx - 1], dp[idx - 2] + nums[i]);
        }
        return dp[r - l + 2];
    };
    return max(solve(0, nums.size() - 2), solve(1, nums.size() - 1));
}`},
"LC 1143":{title:"Alternative: 1D DP",note:"O(mn) time, O(n) space; store previous diagonal manually.",code:`int longestCommonSubsequence(string text1, string text2) {
    vector<int> dp(text2.size() + 1, 0);
    for (char a : text1) {
        int prevDiag = 0;
        for (int j = 1; j <= text2.size(); ++j) {
            int old = dp[j];
            if (a == text2[j - 1]) dp[j] = prevDiag + 1;
            else dp[j] = max(dp[j], dp[j - 1]);
            prevDiag = old;
        }
    }
    return dp.back();
}`},
"LC 416":{title:"Alternative: Set Of Reachable Sums",note:"Simpler to explain, but can use more overhead than boolean DP.",code:`bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2) return false;
    int target = total / 2;
    unordered_set<int> sums = {0};
    for (int x : nums) {
        auto cur = sums;
        for (int s : cur) if (s + x <= target) sums.insert(s + x);
        if (sums.count(target)) return true;
    }
    return false;
}`}
});
})();
