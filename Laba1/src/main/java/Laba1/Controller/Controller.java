package Laba1.Controller;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;

@RestController
@RequestMapping("students")
public class  Controller {
    private String req = "";
    private String exception = "";
    private Connection getConnection()
    {
        Connection connection = null;
        String URL = "jdbc:postgresql://localhost:9001/postgres";
        String User = "postgres";
        String Password = "123";
        try {
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection(URL, User, Password);
            return connection;
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
            exception = exception + e.getMessage() + "\n";
        }
        return connection;
    }
    @GetMapping
    public String Obj() {
        String dbData = null;
        Connection connection = getConnection();
        Statement statement = null;
        ResultSet rs = null;
        try{
            statement = connection.createStatement();
            rs = statement.executeQuery(req);
            int rowCount = 0;
            ResultSetMetaData rsmd = rs.getMetaData();
            dbData = "<table border=2 id=\"table2\"'><tr>";
            int columnCount = rsmd.getColumnCount();
            for (int i = 0; i < columnCount; i++) {
                dbData = dbData + "<th>" + rsmd.getColumnLabel(i + 1) + "</th>";
            }
            dbData = dbData + "</tr>";
            while (rs.next()) {
                rowCount++;
                dbData = dbData + "<tr>";
                for (int i = 0; i < columnCount; i++) {
                    dbData = dbData + "<td>" + rs.getString(i + 1) + "</td>";
                }
                dbData = dbData + "</tr>";
            }
            dbData = dbData + "</table>";
            statement.close();
            connection.close();
        }
        catch (SQLException e){
            System.out.println(e.getMessage());

        }
        if(dbData==""||dbData==null) return "";
        return dbData;
    }
    @GetMapping("/tables")
    public ArrayList<String> getTables() {
        String str = "SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public';";
        ArrayList<String> arrayList = new ArrayList<String>();
        Connection connection = getConnection();
        Statement statement = null;
        ResultSet rs = null;
        try {
            statement = connection.createStatement();
            rs = statement.executeQuery(str);
            int i =0;
            while (rs.next()) {
                arrayList.add(rs.getString(1));
            }
            statement.close();
            connection.close();
        }
        catch (Exception e){
        }
        return arrayList;
    }
    @PostMapping("/attrib")
    public ArrayList<String> getAttrib(@RequestBody String request) {
        String str = "select * FROM " + request + ";";
        ArrayList<String> arrayList = new ArrayList<String>();
        str.replaceAll("\"", "%22");
        Connection connection = getConnection();
        Statement statement = null;
        ResultSet rs = null;
        try {
            statement = connection.createStatement();
            rs = statement.executeQuery(str);
            ResultSetMetaData rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            for (int j = 0; j < columnCount; j++){
                arrayList.add(rsmd.getColumnLabel(j +1));
            }
            statement.close();
            connection.close();
        }
        catch (Exception e){
        }
        return arrayList;
    }

    @GetMapping("/errors")
    public String getException()
    {
        String string = exception;
        exception = "";
        return string;
    }

    @PostMapping
    public void Request(@RequestBody String request) throws IOException {
        Connection connection = getConnection();
        Statement statement = null;
        ResultSet rs = null;
        final char dm = (char) 34;
        request = request.replaceAll("\\{" + dm + "text"+dm+":"+dm,"");
        request = request.replaceAll(";" + dm + "}" , ";");
        request = request.replaceAll(dm +"}", "");
        request.replaceAll("\"", "%22");
        if(request.indexOf(";") == -1) request =request + ";";
        if ((request.indexOf("select") == -1) && (request.indexOf("SELECT") == -1)) {
            try {

                PreparedStatement s = connection.prepareStatement(request.replaceAll("\\\\", "") );
                s.execute();
                s.close();
                connection.close();
            } catch (Exception e) {
                System.out.println(e.getMessage());
                    exception = exception + e.getMessage() +"\n";
            }
        }
        else {
            try {
                statement = connection.createStatement();
                statement.execute(request);
                req = request;
                statement.close();
                connection.close();
            } catch (Exception e) {
                System.out.println(e.getMessage());
                exception = exception + e.getMessage() +"\n";
            }
        }
    }
}

