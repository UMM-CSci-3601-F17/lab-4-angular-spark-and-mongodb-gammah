#Answers
 
 1. We instantiate a MongoClient, which instantiates an instance, which instantiates a user controller. the user controller in turn loads the users from the mongo collection users.
 2. We create an Finditeratable over the user collection that will search for the requested ID. Then we call it with an Iterator<document>. if it has returned at least one item, we convert the item to json and return it.
 3. We parse the query params hashmap, and see if it includes and age. If it does, we add it to the filterdoc object and then we create and return matchingUsers by calling find on the userCollection with filterDoc as an argument.
 4. They appear to be entries in the MongoDB, including specifications for parts tat need to be matched. We seem to be using them to store search requirements, or as entries in the search results. 
 5. We setup a mokk of the user database, loading literal jsons into documents in the users collection. Prior to that it setsup the relevant part of the database. It records various variables
 6. we create an argmap, to find users with the age 37, parse the json file, and check it's length. finally we stream it through sorting and extraction to guaranty it contents will be in a predictable order, and then compare that order with what we set ahead dof time as valid.
