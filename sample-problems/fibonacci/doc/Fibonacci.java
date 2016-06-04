class Fibonacci {

    public static void main(String args[]) {
        System.out.println(fib(5));
    }

    public static long fib(int n) {
        long a = 0;
        long b = 1;
        long temp = 0;

        for (int i = 0; i < n; i++) {
            //System.out.println(a);
            temp = a + b;
            a = b;
            b = temp;
        }

        return a;
    }
}
