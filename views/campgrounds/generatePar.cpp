class Solution
{
public:
    vector<string> generateParenthesis(int n)
    {
        vector<string> ans;
        for (long long int i = 0; i < (1 << 2 * n); i++)
        {
            string s;
            int setBits = __builtin_popcount(i);
            if (setBits != (2 * n - setBits))
                continue;
            for (long long int j = 0; j < (2 * n); j++)
            {

                if ((i & (1 << j)))
                    s += "(";
                else
                    s += ")";
            }
            stack<char> c;
            bool ok = true;
            for (auto it : s)
            {
                if (it == '(')
                    c.push(it);
                else
                {
                    if (c.empty())
                    {
                        ok = false;
                        break;
                    }
                    else
                    {
                        c.pop();
                    }
                }
            }
            if (ok)
                ans.push_back(s);
        }
        return ans;
    }
};