const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;
const authService = require("../services/authService");
const userService = require("../services/userService");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function (email, password, done) {
            const user = await authService.checkCredentials(email, password);
            if (!user) {
                return done(null, false, {
                    message: "Bạn nhập sai tên đăng nhập hoặc mật khẩu",
                });
            }
            if (!user.active) {
                return done(null, false, {
                    message: "Email chưa được xác thực, vui lòng kiểm tra lại",
                });
            }
            return done(null, user);
        }
    )
);
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    const user = await userService.getUserById(id);
    done(null, user);
});

module.exports = passport;
