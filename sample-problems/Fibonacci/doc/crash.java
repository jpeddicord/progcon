class Fibonacci {

    public static void main(String args[]) {
        System.out.println(fib(5));
    }

    public static long fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        return fib(n) + fib(n-1);
    }
}
