import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import userMemoryService from '../user-memory.js';

describe('user-memory:', () => {
  let user;

  it('should create a user', async () => {
    user = await userMemoryService.create({
      name: 'John Doe',
      email: 'jhon.doe@mail.com',
    });
    
    strictEqual(user.name, 'John Doe');
    strictEqual(user.email, 'jhon.doe@mail.com');
    strictEqual(!!user.id, true);
  });

  it('should find a user by id', async () => {
    const foundUser = await userMemoryService.findById(user.id);
    strictEqual(foundUser, user);
  });

  it('should find all users', async () => {
    const users = await userMemoryService.findAll();
    strictEqual(users.length, 1);
    strictEqual(users[0], user);
  });

  it('should find all users with id criteria', async () => {
    const users = await userMemoryService.findAll({ id: user.id });
    strictEqual(users.length, 1);
    strictEqual(users[0], user);
  });

  it('should find all users with name criteria', async () => {
    const users = await userMemoryService.findAll({ name: 'John Doe' });
    strictEqual(users.length, 1);
    strictEqual(users[0], user);
  });

  it('should update a user', async () => {
    const updatedUsers = await userMemoryService.update(
      { id: user.id },
      { name: 'Jane Doe' }
    );
    strictEqual(updatedUsers.length, 1);
    strictEqual(updatedUsers[0].id, user.id);
    strictEqual(updatedUsers[0].name, 'Jane Doe');
    strictEqual(updatedUsers[0].email, 'jhon.doe@mail.com');
  });

  it('should find all users with email criteria', async () => {
    const users = await userMemoryService.findAll({ email: 'jhon.doe@mail.com' });
    strictEqual(users.length, 1);
    strictEqual(users[0], user);
  });

  it('should remove a user', async () => {
    const removedUsers = await userMemoryService.remove({ id: user.id });
    strictEqual(removedUsers, 1);
    const allUsers = await userMemoryService.findAll();
    strictEqual(allUsers.length, 0);
  });

  it('should remove multiple users', async () => {
    const users = [
      { name: 'John Doe', email: 'jhon.doe@mail.com' },
      { name: 'Jane Doe', email: 'jhon.doe@mail.com' },
      { name: 'Jamy Doe', email: 'jhon.doe@mail.com' },
    ];

    users.forEach((user) => userMemoryService.create(user));

    const removedUserCount = await userMemoryService.remove({ email: 'jhon.doe@mail.com' });
    strictEqual(removedUserCount, 3);

    const allUsers = await userMemoryService.findAll();
    strictEqual(allUsers.length, 0);
  });
});
