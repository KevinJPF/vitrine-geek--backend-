class UserController {
  static async getAll(req, res) {
    const users = "alex, thiago"
    res.json({ message: `Usuarios: (${users})` });
  }
}

export default UserController;
