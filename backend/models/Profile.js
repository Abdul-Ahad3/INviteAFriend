import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      default: '',
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    birthday: {
      type: String,
      default: '',
    },
    cnic: {
      type: String,
      trim: true,
      default: '',
    },
    host: {
      willing: {
        type: Boolean,
        default: false,
      },
      houseLocation: {
        type: String,
        trim: true,
        default: '',
      },
      freeRooms: {
        type: String,
        trim: true,
        default: '',
      },
      facilities: {
        type: String,
        trim: true,
        default: '',
      },
      furnished: {
        type: String,
        enum: ['furnished', 'not-furnished', 'partially-furnished'],
        default: 'furnished',
      },
      additionalInfo: {
        type: String,
        trim: true,
        default: '',
      },
    },
    visitor: {
      willing: {
        type: Boolean,
        default: false,
      },
      homeLocation: {
        type: String,
        trim: true,
        default: '',
      },
      profession: {
        type: String,
        trim: true,
        default: '',
      },
      languages: {
        type: String,
        trim: true,
        default: '',
      },
      interests: {
        type: String,
        trim: true,
        default: '',
      },
      travelStyle: {
        type: String,
        trim: true,
        default: '',
      },
      bio: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
