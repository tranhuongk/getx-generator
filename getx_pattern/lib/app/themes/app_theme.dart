import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:getx_generator/app/themes/app_colors.dart';

class AppThemes {
  AppThemes._();

  static final ThemeData themData = ThemeData(
    primarySwatch: AppColors.kPrimaryColor,
    primaryColor: AppColors.kPrimaryColor,
    visualDensity: VisualDensity.adaptivePlatformDensity,
    textTheme: GoogleFonts.sourceSansProTextTheme(),
  );
}
