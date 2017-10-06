package umm3601.todo;

import org.bson.types.ObjectId;

public class Todo {
    ObjectId _id;
    boolean status;
    String owner;
    String category;
    String body;
}
