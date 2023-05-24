const users = [];

export default {
  findAll: async function (criteria, options = {}) {
    let filteredUsers = users.filter((user) => {
      if (!criteria) return true;
      return Object.keys(criteria).every((key) => {
        return user[key] === criteria[key];
      });
    });
    if (options.order)
      filteredUsers = filteredUsers.sort((a, b) => {
        return Object.keys(options.order).reduce((acc, key) => {
          return acc || a[key] - b[key];
        }, 0);
      });
    if (options.offset)
      filteredUsers = filteredUsers.slice(
        options.offset,
        options.offset + options.limit
      );

    return filteredUsers;
  },
  findById: async function (id) {
    return users.find((user) => user.id === id);
  },
  create: async function (data) {
    const user = { id: Date.now(), ...data };
    users.push(user);
    return user;
  },
  update: async function (criteria, data) {
    const usersToModify = await this.findAll(criteria);
    usersToModify.forEach((user) => {
      Object.assign(user, data);
    });
    return usersToModify;
  },
  remove: async function (criteria) {
    const usersToRemove = await this.findAll(criteria);
    usersToRemove.forEach((user) => {
      const index = users.indexOf(user);
      users.splice(index, 1);
    });
    return usersToRemove.length;
  },
};
