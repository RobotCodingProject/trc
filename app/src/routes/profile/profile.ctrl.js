"use strict";
// Mock profile data (replace with DB integration later)
const profileData = {
  fullName: "John Doe",
  username: "johndoe123",
  email: "john.doe@example.com",
  contactNumber: "+1234567890",
  availability: "Monday to Friday",
  assignedShift: "Morning",
};
// Render profile page
exports.getProfile = (req, res) => {
  res.render("profile/profile", { profile: profileData });
};
// Render profile edit page
exports.editProfile = (req, res) => {
  res.render("profile/profile-edit", { profile: profileData });
};
// Handle profile update (POST)
exports.updateProfile = (req, res) => {
  const { fullName, email, contactNumber, availability, assignedShift } =
    req.body;
  profileData.fullName = fullName || profileData.fullName;
  profileData.email = email || profileData.email;
  profileData.contactNumber = contactNumber || profileData.contactNumber;
  profileData.availability = availability || profileData.availability;
  profileData.assignedShift = assignedShift || profileData.assignedShift;
  res.redirect("/profile");
};
