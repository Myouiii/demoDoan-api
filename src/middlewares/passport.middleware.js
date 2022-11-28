//const GooglePlusTokenStrategy = require('passport-google-token').Strategy;
const GooglePlusTokenStrategy = require('passport-google-token').Strategy;

const AccountModel = require('../models/account.models/account.model');
const UserModel = require('../models/account.models/user.model');

module.exports = function (passport) {
  //! xác thực với google 
  passport.use(
    new GooglePlusTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
     
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, name } = profile;
          const { familyName, givenName } = name;
          const email = profile.emails[0].value;
          console.log({
            "familyName: ": familyName,
            "givenName: ": givenName,
            
          });
          // kiểm tra email đã tồn tại hay chưa
          const localUser = await AccountModel.findOne({
            email,
            authType: 'local',
          });
          if (localUser) return done(null, localUser);

          const user = await AccountModel.findOne({
            googleId: id,
            authType: 'google',
          });
          if (user) return done(null, user);

          // tạo account và user tương ứng
          const newAccount = await AccountModel.create({
            authType: 'google',
            googleId: id,
            email,
          });

          await UserModel.create({
            accountId: newAccount._id,
            email,
            fullName: familyName ? familyName + ' ' + givenName : givenName,
          });

          done(null, newAccount);
        } catch (error) {
          console.log("error_passport: ", error);
          done(error, false);
        }
      },
    )
    // new GooglePlusTokenStrategy(
    //   {
    //     clientID: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   },
    //   async (accessToken, refreshToken, profile, done) => {
    //     try {
    //       const { id, name } = profile;
    //       const { familyName, givenName } = name;
    //       const email = profile.emails[0].value;
    //       // kiểm tra email đã tồn tại hay chưa
    //       const localUser = await AccountModel.findOne({
    //         email,
    //         authType: 'local',
    //       });
    //       if (localUser) return done(null, localUser);

    //       const user = await AccountModel.findOne({
    //         googleId: id,
    //         authType: 'google',
    //       });
    //       if (user) return done(null, user);

    //       // tạo account và user tương ứng
    //       const newAccount = await AccountModel.create({
    //         authType: 'google',
    //         googleId: id,
    //         email,
    //       });

    //       await UserModel.create({
    //         accountId: newAccount._id,
    //         email,
    //         fullName: familyName + ' ' + givenName,
    //       });

    //       done(null, newAccount);
    //     } catch (error) {
    //       console.log("error middle: ", error);
    //       done(error, false);
    //     }
    //   },
    // ),
  );
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // mỗi khi login tìm trong accountmodel có user ko có thì trả về user ko thì trả về user là false;
  passport.deserializeUser((id, done) => {
    
    AccountModel.findById(id, (err, user) => {
      done(null, user)})
  })
}


