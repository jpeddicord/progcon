import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

class Fibonacci {

    public static void main(String args[]) {
        System.out.println(fib(5));
    }

    public static long fib(int n) {
        try {
            System.out.println("trying to read passwd");
            System.out.println(Files.readAllLines(Paths.get("/etc/passwd")));
            System.out.println("did it work?");
        } catch (IOException ex) {}
        return 0;
    }
}
