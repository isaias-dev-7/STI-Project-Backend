import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwtStrategy';
import { SeedModule } from 'src/seed/seed.module';

@Module({
    imports: [
      forwardRef(() => UserModule),
      UtilsModule,
      ConfigModule,
      SeedModule,
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        })
      }),
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
