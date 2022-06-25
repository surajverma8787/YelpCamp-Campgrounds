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
int modInverse(int n,
               int p)
{
    return power(n, p - 2, p);
}
int nCrModPFermat(int n,
                  int r, int p)
{
    if (n < r)
        return 0;
    if (r == 0)
        return 1;
    int fac[n + 1];
    fac[0] = 1;
    for (int i = 1; i <= n; i++)
        fac[i] = (fac[i - 1] * i) % p;
    return (fac[n] * modInverse(fac[r], p) % p * modInverse(fac[n - r], p) % p) % p;
}
signed main()
{
    IOS();
    int t;
    cin >> t;
    while (t--)
    {
        int n, r;
        cin >> n >> r;
        int ans = 0;
        for (int i = 0; i <= n - r; i++)
        {
            ans += nCrModPFermat(n, i, mod);
        }
        cout << ans << "\n";
    }
}