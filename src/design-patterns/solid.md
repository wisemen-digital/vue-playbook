#### [Design patterns](/design-patterns.md)

# SOLID Principles

The SOLID principles of object-oriented programming. These principles are the foundation of object-oriented design and are used to make our code more maintainable, flexible, and reusable.

## Single responsibility

> A class should have one, and only one, reason to change.

If our classes assume multiple responsibilities, they will be highly coupled thus making them more difficult to maintain.

### Example

❌ Bad: A single composable that handles fetching users, formatting display names, and managing toast notifications.

```vue
<script setup lang="ts">
// useUsers.ts — does too many things
function useUsers() {
  const users = ref<User[]>([]);
  const toast = ref('');

  async function fetchUsers() {
    const { data } = await axios.get('/api/users');
    users.value = data;
  }

  function getDisplayName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  function showToast(message: string) {
    toast.value = message;
    setTimeout(() => (toast.value = ''), 3000);
  }

  return { users, toast, fetchUsers, getDisplayName, showToast };
}
</script>
```

✅ Good: Split each responsibility into its own composable.

```vue
<script setup lang="ts">
// useUsers.ts — only handles fetching users
function useUsers() {
  const users = ref<User[]>([]);

  async function fetchUsers() {
    const { data } = await axios.get('/api/users');
    users.value = data;
  }

  return { users, fetchUsers };
}

// useUserFormat.ts — only handles display formatting
function useUserFormat() {
  function getDisplayName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  return { getDisplayName };
}

// useToast.ts — only handles toast notifications
function useToast() {
  const toast = ref('');

  function showToast(message: string) {
    toast.value = message;
    setTimeout(() => (toast.value = ''), 3000);
  }

  return { toast, showToast };
}
</script>
```

Now each composable has a single reason to change: `useUsers` for data fetching, `useUserFormat` for display logic, and `useToast` for notifications.

## Open closed

> Modules should be open for extension but closed for modification

That means that if you want to extend a module's behavior, you won't need to modify the existing code of that module.

### Example

```typescript 
class Person {
  constructor(firstName, lastName, hobby, education, workplace, position) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.hobby = hobby;
    this.education = education;
    this.workplace = workplace;
    this.position = position;
  }
}

function personFilter(persons: Person[], filterType: string): Person[] {
  if(filterType === 'firstName'){
    return persons.filter(person => person.firstName === firstName);
  }

  if(filterType === 'lastName'){
    return persons.filter(person => person.lastName === lastName);
  }
  
  if(filterType === 'hobby'){
    return persons.filter(person => person.hobby === hobby);
  }
}
```

The problem with personFilter function is that if we want to filter by any other new property, we have to change the internal working inside the personFilter function.

Let's solve this problem by allowing the filter to accept any prop name and allow it to directly filter it.

```typescript 
function personFilter(persons: Person[], propName: string): Person[] {
  return array.filter(element => element[propName] === value)
}
```

Now we can filter by any property we want without changing the code inside of the function.

## Liskov substitution Principles

> Subclasses should be substitutable for their base class.

### Example

❌ Bad: A subclass that breaks the behavior of the parent class.

```typescript 
class Bird {
  fly(): string {
    return 'Flying';
  }
}

class Penguin extends Bird {
  fly(): string {
    throw new Error('Penguins cannot fly!');
  }
}

function makeBirdFly(bird: Bird): string {
  return bird.fly(); // Breaks if bird is a Penguin
}
```

✅ Good: Restructure so that subclasses don't violate parent behavior.

```typescript 
class Bird {
  move(): string {
    return 'Moving';
  }
}

class FlyingBird extends Bird {
  move(): string {
    return 'Flying';
  }
}

class Penguin extends Bird {
  move(): string {
    return 'Swimming';
  }
}

function makeBirdMove(bird: Bird): string {
  return bird.move(); // Works for any Bird subclass
}
```

Now `Penguin` can be substituted anywhere a `Bird` is expected without breaking the code.

## Interface Segregation Principle

> Clients should not be forced to depend upon interfaces that they don't use.

### Example

❌ Bad: A single large interface forces classes to implement methods they don't need.

```typescript 
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class  implements Worker {
  work(): void { /* working */ }
  eat(): void { /* Robots don't eat! */ }
  sleep(): void { /* Robots don't sleep! */ }
}
```

✅ Good: Split into smaller, focused interfaces.

```typescript 
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work(): void { /* working */ }
  eat(): void { /* eating */ }
  sleep(): void { /* sleeping */ }
}

class Robot implements Workable {
  work(): void { /* working */ }
}
```

Now `Robot` only implements what it actually needs.

## Dependency Inversion Principles

> High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

DIP helps us reduce or eliminate tight coupling between modules in our code through the use of abstractions.

At its core, the principle advocates for two things.

The first is that essential policies and business logic should not depend on low-level, volatile details such as a database connection or file system.

Second, these lower-level concerns and components should be loosely coupled and reusable through meaningful abstractions.

### Example

❌ Bad: A high-level module directly depends on a low-level module.

```typescript 
class MySQLDatabase {
  save(data: string): void {
    // saves to MySQL
  }
}

class UserService {
  private database = new MySQLDatabase();

  saveUser(data: string): void {
    this.database.save(data);
  }
}
```

✅ Good: Both depend on an abstraction (interface).

```Typescript
interface Database {
  save(data: string): void;
}

class MySQLDatabase implements Database {
  save(data: string): void {
    // saves to MySQL
  }
}

class MongoDatabase implements Database {
  save(data: string): void {
    // saves to MongoDB
  }
}

class UserService {
  constructor(private database: Database) {}

  saveUser(data: string): void {
    this.database.save(data);
  }
}
```

Now `UserService` depends on the `Database` abstraction, not a specific implementation. We can swap databases without changing `UserService`.
