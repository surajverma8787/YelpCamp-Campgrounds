#include <bits/stdc++.h>
#define int long long int
#define IOS()                         \
    ios_base::sync_with_stdio(false); \
    cin.tie(NULL);                    \
    cout.tie(NULL)
#define mod 1000000007
const int sz = 2 * 1e5 + 5;
using namespace std;
int power(int x, int y, int m)
{
    if (y == 0)
        return 1;

    int p = power(x, y / 2, m) % m;
    p = (p * p) % m;

    return (y % 2 == 0) ? p : (x * p) % m;
}
int mdinn(int n) { return power(n, mod - 2, mod); }
int n, m;
int a[1005][1005];
bool vis[1005][1005];
bool ok = false;
int dx[2] = {0, 1};
int dy[2] = {1, 0};
bool check(int x, int y)
{
    if (x < 0 || y < 0 || x >= n || y >= m)
        return false;
    return true;
}
void dfs(int x, int y, int sum)
{
    if (x == n - 1 && y == m - 1 && sum == 0)
    {
        ok = true;
        return;
    }
    for (int i = 0; i < 2 && !ok; i++)
    {
        int xx = x + dx[i], yy = y + dy[i];
        if (check(xx, yy))
            dfs(xx, yy, sum + a[xx][yy]);
    }
}
signed main()
{
    IOS();
    int t;
    cin >> t;
    while (t--)
    {

        cin >> n >> m;
        ok = false;
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < m; j++)
                cin >> a[i][j];
        }
        dfs(0, 0, a[0][0]);
        if (ok)
            cout << "YES\n";
        else
            cout << "NO\n";
    }
}