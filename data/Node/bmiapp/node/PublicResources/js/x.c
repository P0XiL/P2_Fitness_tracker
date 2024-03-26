#include <stdio.h>
#include<time.h>

#define N 1024

long A[N][N];
long B[N][N];


void rot1(){
  for(int i=0;i<N;i++) {
   for(int j=0;j<N;j++) {
     B[j][i]=A[i][j];
   }
  }
}


void rot2(){
  for(int j=0;j<N;j++) {
   for(int i=0;i<N;i++) {
     B[j][i]=A[i][j];
   }
  }
}

void printArr(long A[N][N]){
  for(int i=0;i<N;i++) {
   for(int j=0;j<N;j++) {
     printf("%ld ", A[i][j]);
   }
   printf("\n");
 }
}
void initArrs(){
  for(int i=0;i<N;i++) {
   for(int j=0;j<N;j++) {
     B[i][j]=0;
     A[i][j]=i*N+j;
   }
 }
}
void printDiff(clock_t start,clock_t end){

  printf("Duration: %ld cycles\n",end-start);
  printf("Duration: %lf milli secs\n", (double) (end-start)/CLOCKS_PER_SEC);
  printf("Resulution: %ld\n", CLOCKS_PER_SEC);
}

int main(){
  clock_t start;
  clock_t end;

  initArrs();
  //printArr(A);
  start=clock();
  rot2();
  end=clock();
  printDiff(start,end);
  //printArr(B);
}

/*
Resulution: 1000000
root@AAU131963:~# ./a.out
Duration: 15517 cycles
Duration: 0.015517 milli secs
Resulution: 1000000
root@AAU131963:~# ./a.out
Duration: 16870 cycles
Duration: 0.016870 milli secs
Resulution: 1000000
root@AAU131963:~# fg
nano cacheWrite.c


Use "fg" to return to nano.

[1]+  Stopped                 nano cacheWrite.c
root@AAU131963:~# gcc cacheWrite.c
root@AAU131963:~# ./a.out
Duration: 7277 cycles
Duration: 0.007277 milli secs
Resulution: 1000000
root@AAU131963:~# ./a.out
Duration: 5086 cycles
Duration: 0.005086 milli secs
Resulution: 1000000
root@AAU131963:~# ./a.out
Duration: 6475 cycles
Duration: 0.006475 milli secs
Resulution: 1000000
root@AAU131963:~#
*/