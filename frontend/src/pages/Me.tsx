import React, { useMemo, useState } from 'react';

type ProfileForm = {
  username: string;
  name: string;
  location: string;
  birthday: string;
  cnic: string;
  willingHost: boolean;
  houseLocation: string;
  freeRooms: string;
  facilities: string;
  furnished: string;
  hostInfo: string;
  willingVisitor: boolean;
  homeLocation: string;
  profession: string;
  languages: string;
  interests: string;
  travelStyle: string;
  visitorInfo: string;
};

const defaultProfile: ProfileForm = {
  username: '',
  name: '',
  location: '',
  birthday: '',
  cnic: '',
  willingHost: false,
  houseLocation: '',
  freeRooms: '',
  facilities: '',
  furnished: 'furnished',
  hostInfo: '',
  willingVisitor: false,
  homeLocation: '',
  profession: '',
  languages: '',
  interests: '',
  travelStyle: '',
  visitorInfo: '',
};

const calculateAge = (birthday: string) => {
  if (!birthday) {
    return '';
  }

  const birthDate = new Date(birthday);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
    return '';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return String(age);
};

const getSavedProfile = () => {
  const savedProfile = localStorage.getItem('profile');

  if (!savedProfile) {
    return defaultProfile;
  }

  try {
    return { ...defaultProfile, ...JSON.parse(savedProfile) };
  } catch {
    return defaultProfile;
  }
};

const Me: React.FC = () => {
  const [profile, setProfile] = useState<ProfileForm>(getSavedProfile);
  const [saveMessage, setSaveMessage] = useState('');
  const age = useMemo(() => calculateAge(profile.birthday), [profile.birthday]);

  const updateField = (
    field: keyof ProfileForm,
    value: string | boolean,
  ) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setSaveMessage('');
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('profile', JSON.stringify(profile));
    setSaveMessage('Profile saved.');
  };

  return (
    <main className="page profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>
          Complete the details people need to trust you as a verified visitor,
          host, or both.
        </p>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Personal Info</h2>
            {age && <span className="profile-chip">Age {age}</span>}
          </div>

          <div className="profile-grid">
            <label>
              Username
              <input
                type="text"
                value={profile.username}
                onChange={(event) => updateField('username', event.target.value)}
                placeholder="your_username"
              />
            </label>
            <label>
              Name
              <input
                type="text"
                value={profile.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Your full name"
              />
            </label>
            <label>
              Location
              <input
                type="text"
                value={profile.location}
                onChange={(event) => updateField('location', event.target.value)}
                placeholder="Islamabad, Pakistan"
              />
            </label>
            <label>
              Birthday
              <input
                type="date"
                value={profile.birthday}
                onChange={(event) => updateField('birthday', event.target.value)}
              />
            </label>
            <label>
              CNIC Number
              <input
                type="text"
                value={profile.cnic}
                onChange={(event) => updateField('cnic', event.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
              />
            </label>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Host Profile</h2>
            <button
              type="button"
              className={`btn btn-outline ${profile.willingHost ? 'active' : ''}`}
              onClick={() => updateField('willingHost', !profile.willingHost)}
            >
              {profile.willingHost
                ? 'Willing to be a Host'
                : 'Are you willing to be a Host?'}
            </button>
          </div>

          <div className="profile-grid">
            <label>
              House Location
              <input
                type="text"
                value={profile.houseLocation}
                onChange={(event) =>
                  updateField('houseLocation', event.target.value)
                }
                placeholder="Sector, city, nearby landmark"
              />
            </label>
            <label>
              Number of Free Rooms
              <input
                type="number"
                min="0"
                value={profile.freeRooms}
                onChange={(event) => updateField('freeRooms', event.target.value)}
                placeholder="1"
              />
            </label>
            <label>
              Furnishing
              <select
                value={profile.furnished}
                onChange={(event) => updateField('furnished', event.target.value)}
              >
                <option value="furnished">Furnished</option>
                <option value="not-furnished">Not furnished</option>
                <option value="partially-furnished">Partially furnished</option>
              </select>
            </label>
            <label>
              Facilities
              <textarea
                value={profile.facilities}
                onChange={(event) => updateField('facilities', event.target.value)}
                placeholder="Wi-Fi, private bath, parking, workspace"
              />
            </label>
            <label className="profile-wide-field">
              Additional Info
              <textarea
                value={profile.hostInfo}
                onChange={(event) => updateField('hostInfo', event.target.value)}
                placeholder="House rules, family setup, accessibility, pets, smoking policy"
              />
            </label>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Visitor Profile</h2>
            <button
              type="button"
              className={`btn btn-outline ${
                profile.willingVisitor ? 'active' : ''
              }`}
              onClick={() =>
                updateField('willingVisitor', !profile.willingVisitor)
              }
            >
              {profile.willingVisitor
                ? 'Willing to be a Visitor'
                : 'Are you willing to be a Visitor?'}
            </button>
          </div>

          <div className="profile-grid">
            <label>
              Home Location
              <input
                type="text"
                value={profile.homeLocation}
                onChange={(event) =>
                  updateField('homeLocation', event.target.value)
                }
                placeholder="City, country"
              />
            </label>
            <label>
              Profession
              <input
                type="text"
                value={profile.profession}
                onChange={(event) => updateField('profession', event.target.value)}
                placeholder="AI engineer, founder, student"
              />
            </label>
            <label>
              Languages
              <input
                type="text"
                value={profile.languages}
                onChange={(event) => updateField('languages', event.target.value)}
                placeholder="English, Urdu"
              />
            </label>
            <label>
              Interests
              <input
                type="text"
                value={profile.interests}
                onChange={(event) => updateField('interests', event.target.value)}
                placeholder="AI, startups, food, culture"
              />
            </label>
            <label>
              Travel Style
              <input
                type="text"
                value={profile.travelStyle}
                onChange={(event) =>
                  updateField('travelStyle', event.target.value)
                }
                placeholder="Quiet, social, work-focused"
              />
            </label>
            <label className="profile-wide-field">
              Visitor Bio
              <textarea
                value={profile.visitorInfo}
                onChange={(event) =>
                  updateField('visitorInfo', event.target.value)
                }
                placeholder="A short intro that helps hosts know who they are welcoming"
              />
            </label>
          </div>
        </section>

        <div className="profile-actions">
          {saveMessage && <span className="profile-save-message">{saveMessage}</span>}
          <button type="submit" className="btn primary">
            Save Profile
          </button>
        </div>
      </form>
    </main>
  );
};

export default Me;
