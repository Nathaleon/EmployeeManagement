import User from "../models/UserModel.js";
import Position from "../models/PositionModel.js";
import Department from "../models/DepartmentModel.js";
import Login from "../models/LoginModel.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

// Ambil semua user dengan include relasi
export const getUsers = async (req, res) => {
  try {
    console.log("Getting users with includes...");
    const response = await User.findAll({
      include: [
        {
          model: Position,
          attributes: ['id', 'name']
        },
        {
          model: Department,
          attributes: ['id', 'name']
        },
        {
          model: Login,
          as: 'addedByUser',
          attributes: ['id', 'username']
        }
      ],
      order: [['id', 'DESC']] // Optional: Sort by newest first
    });
    console.log("Users found:", response.length);
    res.status(200).json(response);
  } catch (error) {
    console.error("Detailed error in getUsers:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      msg: "Internal Server Error",
      error: error.message 
    });
  }
};

// Ambil satu user berdasarkan ID dengan include relasi
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Position,
          attributes: ['id', 'name']
        },
        {
          model: Department,
          attributes: ['id', 'name']
        },
        {
          model: Login,
          as: 'addedByUser',
          attributes: ['id', 'username']
        }
      ]
    });
    if (!response) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Tambahkan user baru - Menyertakan foto (URL string) dan positionId
export const createUser = async (req, res) => {
  try {
    const { nama, nip, departmentId, positionId, foto } = req.body;
    
    // Validasi field yang required
    if (!nama || !nip || !departmentId || !positionId) {
      return res.status(400).json({ 
        msg: "All fields are required (nama, nip, departmentId, positionId)" 
      });
    }

    // Validasi apakah department dan position ada
    const departmentExists = await Department.findByPk(departmentId);
    if (!departmentExists) {
      return res.status(400).json({ msg: "Department not found" });
    }

    const positionExists = await Position.findByPk(positionId);
    if (!positionExists) {
      return res.status(400).json({ msg: "Position not found" });
    }

    // Cek apakah NIP sudah ada
    const existingUser = await User.findOne({ where: { nip } });
    if (existingUser) {
      return res.status(400).json({ msg: "NIP already exists" });
    }

    const newUser = await User.create({
      nama,
      nip,
      departmentId,
      positionId,
      foto,
      addedByUserId: req.userId // Set addedByUserId to the admin's ID
    });

    res.status(201).json({ 
      msg: "User Created",
      user: newUser
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update user - Memperbarui foto dan positionId jika ada perubahan
export const updateUser = async (req, res) => {
  try {
    const { nama, nip, departmentId, positionId, foto } = req.body;
    
    const user = await User.findOne({
      where: {
        id: req.params.id
      },
    });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Validasi department jika diubah
    if (departmentId && departmentId !== user.departmentId) {
      const departmentExists = await Department.findByPk(departmentId);
      if (!departmentExists) {
        return res.status(400).json({ msg: "Department not found" });
      }
    }

    // Validasi position jika diubah
    if (positionId && positionId !== user.positionId) {
      const positionExists = await Position.findByPk(positionId);
      if (!positionExists) {
        return res.status(400).json({ msg: "Position not found" });
      }
    }

    // Cek NIP jika diubah
    if (nip && nip !== user.nip) {
      const existingUser = await User.findOne({ 
        where: { 
          nip,
          id: { [Op.ne]: req.params.id } // Exclude current user
        } 
      });
      if (existingUser) {
        return res.status(400).json({ msg: "NIP already exists" });
      }
    }

    // Update fields
    user.nama = nama || user.nama;
    user.nip = nip || user.nip;
    user.departmentId = departmentId || user.departmentId;
    user.positionId = positionId || user.positionId;
    user.foto = foto || user.foto;
    
    await user.save();
    
    res.status(200).json({ 
      msg: "User Updated",
      user: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Hapus user
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: {
        id: req.params.id,
        addedByUserId: req.userId,
      },
    });
    if (!deleted) {
      return res.status(404).json({ msg: "User not found or unauthorized" });
    }
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get users by creator ID
export const getUsersByCreator = async (req, res) => {
  try {
    console.log("Getting users for creator ID:", req.params.creatorId);
    const response = await User.findAll({
      where: {
        addedByUserId: req.params.creatorId
      },
      include: [
        {
          model: Position,
          attributes: ['id', 'name']
        },
        {
          model: Department,
          attributes: ['id', 'name']
        },
        {
          model: Login,
          as: 'addedByUser',
          attributes: ['id', 'username']
        }
      ],
      order: [['id', 'DESC']]
    });
    console.log("Found users:", response.length);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getUsersByCreator:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
