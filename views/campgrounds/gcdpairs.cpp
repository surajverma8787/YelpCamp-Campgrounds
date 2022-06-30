#include <bits/stdc++.h>
using namespace std;
vector<int> getPrimeFactors(int a, const vector<int> &primes)
{
    vector<int> f;
    for (auto p : primes)
    {
        if (p > a)
            break;
        if (a % p == 0)
        {
            f.push_back(p);
            do
            {
                a /= p;
            } while (a % p == 0);
        }
    }
    if (a > 1)
        f.push_back(a);

    return f;
}
void solution(const vector<int> &A, const vector<int> &B)
{
    vector<int> primes;
    primes.push_back(2);

    for (int i = 3; i * i <= 1e9; ++i)
    {
        bool isPrime = true;
        for (auto p : primes)
        {
            if (i % p == 0)
            {
                isPrime = false;
                break;
            }
        }
        if (isPrime)
        {
            primes.push_back(i);
        }
    }

    int N = A.size();

    struct Entry
    {
        int n = 0;
        long long int p = 0;
    };
    map<long long int, long long int> cntp;

    for (int i = 0; i < N; i++)
    {
        auto f = getPrimeFactors(A[i], primes);
        vector<Entry> x;
        x.push_back({0, 1});

        for (auto p : f)
        {
            int k = x.size();
            for (int i = 0; i < k; ++i)
            {
                int nn = x[i].n + 1;
                long long int pp = x[i].p * p;

                ++cntp[pp];
                x.push_back({nn, pp});
            }
        }
    }
    long long int cnt = N;
    cnt *= N;

    for (int i = 0; i < N; i++)
    {
        auto f = getPrimeFactors(B[i], primes);

        vector<Entry> x;
        x.push_back({0, 1});

        for (auto p : f)
        {
            int k = x.size();
            for (int i = 0; i < k; ++i)
            {
                int nn = x[i].n + 1;
                long long int pp = x[i].p * p;

                x.push_back({nn, pp});

                if (nn % 2 == 1)
                {
                    cnt -= cntp[pp];
                }
                else
                {
                    cnt += cntp[pp];
                }
            }
        }
    }

    printf("cnt = %d\n", N * N - (int)cnt);
}
int main()
{
    solution({2, 4}, {4, 2});
}