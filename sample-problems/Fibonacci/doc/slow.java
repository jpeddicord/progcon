class Fibonacci {

    public static void main(String args[]) {
        System.out.println(fib(5));
    }

    public static long fib(int n) {
        try {
            // slow enough to take ~3s to finish all tests
            Thread.sleep(200);
        } catch (Exception e) {}

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
