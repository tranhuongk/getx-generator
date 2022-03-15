import 'package:get/get.dart';
import 'package:getx_generator/app/data/provider/home_provider.dart';

class HomeController extends GetxController {
  HomeController({this.provider});
  final HomeProvider? provider;

  final RxInt counter = 0.obs;
  void increase() async {
    counter.value += 1;
  }

  void decrease() {
    counter.value -= 1;
  }
}
