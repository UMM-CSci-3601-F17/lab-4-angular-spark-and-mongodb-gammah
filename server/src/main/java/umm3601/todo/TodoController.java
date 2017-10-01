package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todo data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }


    /**
     * Get a JSON response with a list of all the todos in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one todo in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTodo(Request req, Response res) {
        res.type("application/json");
        String id = req.params("id");
        String todo;
        try {
            todo = getTodo(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (todo != null) {
            return todo;
        } else {
            res.status(404);
            res.body("The requested todo with id " + id + " was not found");
            return "";
        }
    }


    /**
     * Get the single todo specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired todo
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }


    /**
     * @param req
     * @param res
     * @return an array of todos in JSON formatted String
     */
    public String getTodos(Request req, Response res) {
        res.type("application/json");
        return getTodos(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetOwner = (queryParams.get("owner")[0]);
            filterDoc = filterDoc.append("owner", targetOwner);
        }

        if (queryParams.containsKey("body")) {
            String targetBody = (queryParams.get("body")[0]);
            filterDoc = filterDoc.append("body", targetBody);
        }

        if(queryParams.containsKey("status")){
            boolean targetStatus = ("true" == (queryParams.get("status")[0]));
            filterDoc = filterDoc.append("status", targetStatus);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    /**
     * @param req
     * @param res
     * @return
     */
    public boolean addNewTodo(Request req, Response res) {
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if (o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    //For some reason age is a string right now, caused by angular.
                    //This is a problem and should not be this way but here ya go.
                    //yay!
                    boolean status = (dbO.getString("status") == "true");
                    String category = dbO.getString("category");
                    String body = dbO.getString("body");

                    System.err.println("Adding new todo [owner=" + owner + ", status=" + status + " category=" + category + " body=" + body + ']');
                    return addNewTodo(owner, status, category,body);
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new todo request failed.");
                    return false;
                }

            } else {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        } catch (RuntimeException ree) {
            ree.printStackTrace();
            return false;
        }
    }

    /**
     * @param owner
     * @param status
     * @param category
     * @param body
     * @return success or fail as a boolean
     */
    public boolean addNewTodo(String owner, boolean status,  String category, String body) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("category", category);
        newTodo.append("body", body);

        try {
            todoCollection.insertOne(newTodo);
        } catch (MongoException me) {
            me.printStackTrace();
            return false;
        }

        return true;
    }


}


