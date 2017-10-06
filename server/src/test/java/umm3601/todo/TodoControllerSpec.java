package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import spark.Request;
import spark.Response;
import spark.routematch.RouteMatch;
import umm3601.todo.TodoController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * JUnit tests for the TodoController.
 *
 * Created by mcphee on 22/2/17.
 */
public class TodoControllerSpec
{
    private TodoController todoController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
                "                    owner: \"Chris\",\n" +
                "                    status: false,\n" +
                "                    category: \"homework\",\n" +
                "                    body: \"add an underscore to make that error you had for a whole day go away\"\n" +
                "                }"));
        testTodos.add(Document.parse("{\n" +
                "                    owner: \"Pat\",\n" +
                "                    status: true,\n" +
                "                    category: \"video games\",\n" +
                "                    body: \"latin words or something\"\n" +
                "                }"));
        testTodos.add(Document.parse("{\n" +
                "                    owner: \"Jamie\",\n" +
                "                    status: true,\n" +
                "                    category: \"groceries\",\n" +
                "                    body: \"head down to spud corp for some delicious potatoes\"\n" +
                "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("owner", "Sam")
                .append("status", false)
                .append("category", "homework")
                .append("body", "be done with csci lab");



        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
                = CodecRegistries.fromProviders(Arrays.asList(
                new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
                .stream()
                .map(TodoControllerSpec::getOwner)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
        assertEquals("Owners should match", expectedOwners, owners);
    }

    @Test
    public void getTodosThatAreDone() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "true" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owners = docs
                .stream()
                .map(TodoControllerSpec::getOwner)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Jamie", "Pat");
        assertEquals("Names should match", expectedOwners, owners);
    }

    @Test
    public void getTodosWithCertainText() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("body", new String[] { "latin words or something" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 todo", 1, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Pat");
        assertEquals("Names should match", expectedOwners, owners);
    }

    @Test
    public void getSamById() {
        String jsonResult = todoController.getTodo(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", sam.get("owner"));
    }

    @Test
    public void getCompletionPercentage(){
        String jsonResult = todoController.getTodoSummary(null, null);
        Document result = Document.parse(jsonResult);
        assertEquals("Should have three fields", 3, result.size());
        assertTrue(result.containsKey("Percent of Complete Todos"));
        assertTrue(result.containsKey("Percent of Complete Todos in Category"));
        assertTrue(result.containsKey("Percent of Complete Todos by Owner"));

//        //check percentages
//        ArrayList<Object> tempArray = result.get("Percent of Complete Todos");
//
//        Map<String, Object> overallResult = tempArray.get(0);
//        assertEquals("Should only have three todos", Double.valueOf(3), overallResult.getInteger("total"));
    }
}
